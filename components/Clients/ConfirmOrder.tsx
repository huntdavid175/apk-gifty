"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import Countdown from "../Dashboard/DashUtils/Countdown";
import DisplayDialog from "../UI/Dialog/Dialog";
import Chat from "../Dashboard/DashUtils/Chat";
import Lottie from "lottie-react";
import loadingAnimation from "@/components/Animations/Lottie/blueloading.json";
import CancelOrderDialog from "../UI/Dialog/CancelOrderDialog";
import Payment from "./Payment";
import PurchaseButton from "./PurchaseButton";
import CancelButton from "./CancelButton";
import ReportIcon from "@mui/icons-material/Report";
import { toast } from "react-toastify";
import MomoPaymentDialog from "../UI/Dialog/MomoPaymentDialog";
import { TradeCompletedDialog } from "../UI/Dialog/TradeCompletedDialog";
import { TradeSummary } from "./TradeSummary";

interface Props {
  paymentMethods: any;
  orderData: any;
  token: any;
  rate: string;
}

// const getOrder = async (id: string) => {
//   try {
//     const response = await axios.get("/api/get-order", { params: { id: id } });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

const ConfirmOrder: React.FC<Props> = ({
  paymentMethods,
  orderData,
  token,
  // rate,
}) => {
  const {
    price,
    description,
    quantity,
    id,
    instructions,
    status,
    notify_seller,
    processing_end_time,
    category,
    type,
    is_paid,
    rate,
    product,
    cash_value,
    payment_transaction_id,
  } = orderData;

  // console.log(orderData);

  const [openDialog, setOpenDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [makePayment, setMakePayment] = useState(false);
  const [openMomoDialog, setOpenMomoDialog] = useState(false);
  const [paystackLink, setPaystackLink] = useState("");

  const [statuss, setStatuss] = useState(status);
  const [stop, setStop] = useState("");
  const [tradeCompleted, setTradeCompleted] = useState(false);

  const [chat, setChat] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Truncing price to show 0.00
  const fees = Math.trunc(0.01 * price * 100) / 100;

  const paths = usePathname().split("/");

  const pathname = paths[paths.length - 1];

  const router = useRouter();

  const notifySeller = async (id: string) => {
    let data = JSON.stringify({ id });

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "/api/notify-seller",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    try {
      setLoading(true);
      const response = await axios(config);

      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
      setMakePayment(false);
    }
  };

  const makeUSDTPayment = async (id: number, loadingFunc: any) => {
    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `/api/usdt-payment/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: { id },
    };
    try {
      loadingFunc(true);
      const response = await axios(config);

      if (response.status == 200) {
        // console.log(response.data);
        return response.data;
      }
    } catch (error: any) {
      toast.error("Payment issue, please try again later");
      console.log(error);
    } finally {
      loadingFunc(false);
    }
  };

  useEffect(() => {
    if (!processing_end_time && payment_transaction_id && is_paid == "1") {
      notifySeller(id);
    }
  }, [payment_transaction_id]);

  // useEffect(() => {
  //   const updateStatus = async () => {
  //     // const response = await getOrder(id);
  //     // console.log(response.data);
  //     setLoading(true);
  //     const getOrder = async (id: string) => {
  //       try {
  //         const response = await axios.get(
  //           `${process.env.API_ENDPOINT}/order/${id}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //
  //         // console.log(response.data.data);
  //         setLoading(false);
  //         setStatuss(response.data.data.status);
  //         setStop(response.data.data.processing_end_time);
  //         return response.data;
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getOrder(id);
  //   };
  //
  //   updateStatus();
  //
  //   return () => setLoading(false);
  // }, []);

  const requestPayment = () => {
    const dateNow = new Date();
    setMakePayment(true);
    setStop(dateNow.toISOString());
  };

  // Submit notify-seller request
  const notifySellerHandler = async () => {
    const res = await notifySeller(id);

    setStatuss(String(res.data.status));
    setStop(res.data.processing_end_time);
  };

  const notifySellerHandlerNoTimer = async () => {
    // console.log("no timer", id);
    const res = await notifySeller(id);
    // console.log("notifysellernotimer,", res.data.status);

    setStatuss(String(res.data.status));
  };

  const cancelOrder = async (id: string) => {
    let data = JSON.stringify({ id });

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `/api/cancel-order`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    try {
      setLoading(true);
      const response = await axios(config);
      // console.log(response.data);
      setStatuss(response.data.data.status);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const filteredPaymentMethods = paymentMethods.filter((payment: any) => {
    if (category === "Bank" || category === "Bundle") {
      return payment.channel === "Momo";
    } else {
      return true;
    }
  });

  const handleTradeCompletion = () => {
    setTradeCompleted(true);
    setStatuss("2");
  };

  const closeTradeCompletionDialogHandler = () => {
    setTradeCompleted(false);
  };

  return (
    <>
      <div className="px-2 lg:px-10 w-full lg:w-[60%] lg:overflow-y-auto">
        <div className="mt-10 pb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-blue-500" />
          </div>
          <h1 className="text-2xl font-medium">
            {`Trade ${
              statuss === "0" || statuss === "1"
                ? "Processing"
                : statuss === "2"
                ? "Completed"
                : "Cancelled"
            }`}
          </h1>
        </div>
        {/* {category === "Card" && ( */}
        {statuss === "0" || statuss === "1" ? (
          <div className="flex flex-col gap-y-2 pl-10">
            {pathname === "sell" && (
              <p>
                Rate 1{product.currency.symbol} ={" "}
                <span className="text-[#05F364]">₵{rate}</span>
              </p>
            )}
            {pathname === "buy" && (
              <p>
                Rate 1 USD = <span className="text-[#05F364]">₵{rate}</span>
              </p>
            )}

            <p className="text-xs lg:text-base text-white">
              {` Amount To ${
                pathname === "buy"
                  ? "pay"
                  : pathname === "sell"
                  ? "receive"
                  : null
              } in GHC: `}
              <span className="text-[#05F364]">
                {pathname == "sell" &&
                  `₵${(Number(cash_value) * Number(rate)).toFixed(2)}`}
                {pathname == "buy" &&
                  `₵${(Number(price) * Number(rate)).toFixed(2)}`}
              </span>
            </p>
          </div>
        ) : null}
        {/* // )} */}
        {/* 
        {
          <div className="mt-14">
            <h4 className="text-sm lg:text-lg font-semibold">
              Payment Instructions{" "}
            </h4>
            <p className="mt-10">
              <span className="mr-2 text-orange-600">
                <ReportIcon />
              </span>{" "}
              {instructions}
            </p>
          </div>
        } */}
        {statuss === "0" || statuss === "1" ? (
          <div className="mt-12">
            {statuss === "0" && (
              <p className="text-sm lg:text-base">
                Kindly begin your transaction by clicking &#x27;Start
                Trade&#x27; before proceeding with your payment.
              </p>
            )}

            {pathname === "buy" && (
              <>
                {/* <p className="text-sm lg:text-base text-orange-400 mt-4">
                Amount to pay in Ghana Cedis - GHC{" "}
                {category === "Card"
                  ? (Number(price) * Number(rate)).toFixed(2)
                  : category === "Bank"
                  ? Number(price).toFixed(2)
                  : Number(price).toFixed(2)}
              </p> */}

                {loading ? null : (
                  <>
                    {makePayment && is_paid === "0" && (
                      <>
                        <h3 className="text-white text-sm lg:text-base font-medium mt-8">
                          Select payment method
                        </h3>
                        <ul className="mt-3 flex flex-col items-center gap-y-4">
                          {filteredPaymentMethods.map((method: any) => (
                            <Payment
                              method={method}
                              key={method.id}
                              id={id}
                              // makePayment={sendPayment}
                              loadingFunc={setLoading}
                              notifySeller={notifySellerHandlerNoTimer}
                              orderData={orderData}
                              amountGhc={Number(price) * Number(rate)}
                            />
                          ))}
                        </ul>
                        <div className="mt-4 flex items-start gap-3 px-2">
                          <input
                            id="accept-terms"
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-500 bg-transparent text-blue-500 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="accept-terms"
                            className="text-xs lg:text-sm text-gray-300"
                          >
                            Click to accept our{" "}
                            <a
                              href="/terms-of-service"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline"
                            >
                              Terms & Conditions
                            </a>
                            .
                          </label>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ) : null}
        {statuss === "2" && (
          <div>
            <TradeSummary amount={price} pathname={pathname} />
          </div>
        )}
        {statuss === "0" || statuss === "1" ? (
          <div className="mt-8 space-y-4 flex flex-col lg:flex-row lg:space-x-6 lg:space-y-0">
            {loading ? (
              <div className="w-full flex justify-center">
                <div className="w-[100px] h-[100px] ">
                  <Lottie animationData={loadingAnimation} />
                </div>
              </div>
            ) : (
              <>
                {is_paid === "0" && (
                  <PurchaseButton
                    pathname={pathname}
                    handleSubmit={
                      type === "buy" ? requestPayment : notifySellerHandler
                    }
                    status={statuss}
                  />
                )}

                {is_paid === "0" && (
                  <CancelButton
                    status={statuss}
                    openDialog={setOpenCancelDialog}
                  />
                )}
              </>
            )}
          </div>
        ) : null}
        {loading && status === "" && (
          <div className="w-full flex justify-center">
            <div className="w-[100px] h-[100px] ">
              <Lottie animationData={loadingAnimation} />
            </div>
          </div>
        )}
        <div className="mt-10 flex items-center gap-x-4">
          {Number(statuss) === -1 ? null : Number(statuss) === 2 ? null : (
            <Countdown
              stopTime={stop}
              // action={runAction}
            />
          )}
          {/* {type === "buy" && makePayment && is_paid === "0" && (
            <Countdown
              stopTime={stop}
              // action={runAction}
            />
          )} */}
        </div>

        {/* <div className="flex mt-10 flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 ">
      <button className="w-full flex justify-center items-center gap-x-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <HeadphoneSvg />
        Help center
      </button>
      <button className="w-full flex justify-center items-center gap-x-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <InfoSvg />
        Report
      </button>
      <button className="w-full flex justify-center items-center gap-x-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <EyeSvg />
        Track Transaction
      </button>
    </div> */}
      </div>
      {/* {statuss === "1" && ( */}
      <Chat
        status={statuss}
        chat={chat}
        token={token}
        is_paid={type === "buy" ? is_paid : null}
        id={id}
        handleTradeCompletion={handleTradeCompletion}
      />
      {/* )} */}
      {/* <DisplayDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title="Order Instructions"
        buttonText="Close"
      > */}
      {/* <div className="space-y-6">
          {product.instructions.map((instruction: any) => (
            <p key={instruction.id} className="text-sm lg:text-base">
              {instruction.body}
            </p>
          ))}
        </div> */}
      {/* {category === "Card" && (
          <ol className="text-xs lg:text-sm list-decimal pl-2 space-y-4 text-gray-700">
            <>
              {" "}
              <li>
                Remember every trade that occurs on our platform attracts a fee
                of 1% on every amount. All trades less than $100 will attract a
                $1 fee on it.
              </li>
              <li>
                The card or the code of your order will be uploaded in the chat
                section of this trade. Make sure to use the card within the
                timeframe provided for you.
              </li>
              <li>
                You can always CONFIRM with us in the chat always when Buying or
                Selling A Gift Card incase you want clearance or have to make
                enquiries before making payment to us.
              </li>
              <li>
                Calculating the Ghana Cedis equivalent for payment through
                Mobile Money is as follows, applicable to Local Users in Ghana
                only: Multiply the Rate by the Amount to Pay. For instance, when
                purchasing a &quot;$100 iTunes gift card&quot; with an amount
                due of $72, the computation would be &quot;72 x 11.5 = GHC 828 +
                Fees ($1)&quot;, resulting in a total of GHC 839.
              </li>
            </>
          </ol>
        )}
        {category === "Bundle" && (
          <p>
            Delivery Time: Normally, you&apos;ll receive your bundle within 15
            minutes to 30mins max. However, sometimes the server may delay, and
            it could take up to 1-4 hours. Don&apos;t panic; you will receive
            your bundle. <br />
            Note: Text the number you wish to receive the bundle to the Admin.
            Order will be completed by Admin once bundle is served.
          </p>
        )}
        {category === "Bank" && (
          <p>
            Delivery Time: Normally, you&apos;ll receive your Bank Deposit
            within 10minutes to An hour. <br />
            However, sometimes with order surge may takes sometime for us to
            process it for you.
            <br /> Don&apos;t panic; you will receive your Bank Deposit ASAP.
            <br /> Note: Paste your Account Number, Name you&apos;re depositing
            with and Branch of the Bank.
            <br /> Order will be Completed ✅ by Admin once bundle is served.
          </p>
        )} */}
      {/* </DisplayDialog> */}
      <CancelOrderDialog
        cancelHandler={() => {
          cancelOrder(id);
          setOpenCancelDialog(false);
        }}
        handleClose={() => {
          setOpenCancelDialog(false);
        }}
        open={openCancelDialog}
      />

      {openMomoDialog && (
        <MomoPaymentDialog
          open={openMomoDialog}
          handleClose={() => setOpenMomoDialog(false)}
          momoPaymentLink={paystackLink}
        />
      )}
      <TradeCompletedDialog
        onClose={closeTradeCompletionDialogHandler}
        isOpen={tradeCompleted}
      />
    </>
  );
};

export default ConfirmOrder;
