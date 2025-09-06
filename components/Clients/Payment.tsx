"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import DisplayDialog from "../UI/Dialog/Dialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sendAdminEmail } from "@/utils/emailjs";
import { order } from "@/redux/features/orderSlice";
import MobilePaymentForm from "../Form/MobilePaymentForm";
import { toast } from "react-toastify";
import MiniLoader from "../UI/Loader/MiniLoader";
import CheckedSvg from "../UI/SvgIcons/CheckedSvg";
import NextSvg from "../UI/SvgIcons/NextSvg";
import GradientActionButton from "../UI/GradientActionButton";

const makeMomoPayment = async (
  id: number,
  loadingFunc: any,
  momoPaymentMethod: string,
  momoPhoneNumber: string
) => {
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/api/momo-payment/`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      id,
      paymentMethod: momoPaymentMethod,
      phoneNumber: momoPhoneNumber,
    },
  };
  try {
    // loadingFunc(true);
    const response = await axios(config);
    if (response.status == 200) {
      toast.success("Payment initiated successfully");
      console.log(response.data);
      return response.data;
    }

    // console.log(response.data);
    // if (response.data.status) {
    //   setPaystackLink(response.data.data.authorization_url);
    //   // window.open(`${response.data.data.authorization_url}`, "_blank");
    //   setOpenMomoDialog(true);
    // }
  } catch (error: any) {
    toast.error("Payment issue, please try again later");
    console.log(error);
  } finally {
    loadingFunc(false);
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
    console.log(error);
  } finally {
    loadingFunc(false);
  }
};

const sendPayment = async (
  id: number,
  loadingFunc: any,
  type: string,
  momoPaymentMethod: string,
  momoPhoneNumber: string
) => {
  if (type.toLowerCase() == "momo") {
    const res = await makeMomoPayment(
      id,
      loadingFunc,
      momoPaymentMethod,
      momoPhoneNumber
    );
    return res;
  }
};

const confirmMomoPayment = async (
  id: number,
  loadingFunc: any,
  notifySeller: any
) => {
  try {
    const response = await axios.get(`/api/momo-payment`, { params: { id } });
    if (response.status === 200) {
      if (response.data.is_paid === false) {
        toast.warn("Payment not confirmed. Please try again.");
        return;
      }
      toast.success("Payment confirmed successfully");
      notifySeller();
      return response.data;
    }
  } catch (error: any) {
    console.log(error);
    toast.error("Could not confirm payment. Please try again.");
  }
};

const Payment = ({
  method,
  makePayment,
  id,
  loadingFunc,
  notifySeller,
  orderData,
}: {
  method: any;
  makePayment?: any;
  id: number;
  loadingFunc?: any;
  notifySeller?: any;
  orderData: any;
}) => {
  const [open, setOpen] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [usdtPaymentDetails, setUsdtPaymentDetails] = useState<any>(null);
  const [showUsdtDialog, setShowUsdtDialog] = useState(false);
  const [momoPaymentMethod, setMomoPaymentMethod] =
    useState<string>("MTN_MONEY");
  const [momoPhoneNumber, setMomoPhoneNumber] = useState<string>("");
  const [isMomoLoading, setIsMomoLoading] = useState<boolean>(false);
  const [momoInitiated, setMomoInitiated] = useState<boolean>(false);
  const [momoPaid, setMomoPaid] = useState<boolean>(false);

  let methodImage;
  let dialog;

  if (method.channel.toLowerCase() === "momo") {
    methodImage = "/images/momopayment.jpeg";
  } else if (method.channel.toLowerCase() === "bank") {
    methodImage = "/images/bankpayment.jpeg";
  } else if (method.channel.toLowerCase() === "usdt") {
    methodImage = "/images/usdtpayment.png";
  }

  const handleClick = (e: any) => {
    if (method.channel.toLowerCase() === "usdt") {
      setPaymentInitiated(true);
      setOpen(true);
    }
    setOpen(true);
  };

  const handleMomoPaymentFormInput = (e: any) => {
    if (e.target.name === "paymentMethod") {
      setMomoPaymentMethod(e.target.value);
    } else if (e.target.name === "phoneNumber") {
      setMomoPhoneNumber(e.target.value);
    }
  };

  const handleNotifySeller = async () => {
    try {
      if (method.channel.toLowerCase() === "usdt") {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/crypto/status/${id}`
        );
        // console.log("check status", response.data);
        if (response.data.payment_status === "waiting") {
          return alert(
            "Payment still in progress. Please wait for confirmation..."
          );
        } else {
          notifySeller();
          setOpen(false);
          sendAdminEmail(orderData);
          return;
        }
      }
      if (method.channel.toLowerCase() === "momo") {
        console.log(momoPaymentMethod, momoPhoneNumber);
      }
      // notifySeller();
      // setOpen(false);
      // sendAdminEmail(orderData);
    } catch (error) {
      console.log(error);
    }
  };

  // Guard dialog close for momo after initiation until paid
  const handleGuardedClose = () => {
    if (method.channel.toLowerCase() === "momo" && momoInitiated && !momoPaid) {
      toast.warn("Payment not completed yet. Please authorize on your phone.");
      return;
    }
    setOpen(false);
  };

  // Extracted action handler for MoMo button
  const handleMomoAction = async () => {
    if (momoInitiated) {
      try {
        setIsMomoLoading(true);
        const res = await confirmMomoPayment(id, loadingFunc, notifySeller);
        if (res && res.is_paid) {
          setMomoPaid(true);
          setOpen(false);
        }
      } catch (e) {
        // error toast handled in confirmMomoPayment if any
      } finally {
        setIsMomoLoading(false);
      }
      return;
    }
    try {
      setIsMomoLoading(true);
      const res = await sendPayment(
        id,
        loadingFunc,
        "momo",
        momoPaymentMethod,
        momoPhoneNumber
      );
      if (res) {
        setIsMomoLoading(false);
        setMomoInitiated(true);
      }
    } catch (e) {
      // toast is triggered in makeMomoPayment
    } finally {
      setIsMomoLoading(false);
    }
  };

  const actionLabel = momoInitiated ? "Confirm Payment" : "Make Payment";

  useEffect(() => {
    if (paymentInitiated && method.channel.toLowerCase() === "usdt") {
      (async () => {
        const paymentDets = await makeUSDTPayment(id, setShowUsdtDialog);
        // console.log(paymentDets);

        setUsdtPaymentDetails(paymentDets);
      })();
    }
  }, [paymentInitiated]);

  // Poll every 7s after MoMo initiation to auto-check payment status
  useEffect(() => {
    if (
      method.channel.toLowerCase() === "momo" &&
      momoInitiated &&
      open &&
      !momoPaid
    ) {
      const intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`/api/momo-payment`, { params: { id } });
          if (res.status === 200 && res.data?.is_paid) {
            setMomoPaid(true);
            toast.success("Payment confirmed successfully");
            if (notifySeller) notifySeller();
            setOpen(false);
            clearInterval(intervalId);
          }
        } catch (err) {
          console.log(err);
        }
      }, 7000);

      return () => clearInterval(intervalId);
    }
  }, [method.channel, momoInitiated, open, momoPaid, id]);

  if (method.channel.toLowerCase() === "usdt") {
    dialog = usdtPaymentDetails && (
      <DisplayDialog
        title={method.channel}
        buttonText="Continue"
        open={showUsdtDialog}
        handleClose={() => setOpen(false)}
        sx={{
          backgroundColor: "#161D26",
          borderColor: "black",
          color: "white",
        }}
      >
        <div>
          <div>
            <p className="text-orange-400">
              {usdtPaymentDetails.payment_address}
            </p>
            <p className="text-white mt-2">
              Network: {usdtPaymentDetails?.payment_type?.toUpperCase()}
            </p>
            <p className="text-white mt-2">
              Amount: ${usdtPaymentDetails?.amount}
            </p>
            <div className="text-center mt-3">
              <p
                className="py-2 px-3 bg-primary rounded-2xl text-white flex justify-center items-center gap-x-1 text-xs lg:text-sm cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(
                    usdtPaymentDetails.payment_address
                  )
                }
              >
                <span>
                  <ContentCopyIcon />
                </span>
                Copy Address
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center mt-7">
            <span
              className="text-white text-xs lg:text-sm px-4 py-1 bg-blue-500 cursor-pointer hover:bg-blue-900"
              onClick={handleNotifySeller}
            >
              Payment Sent
            </span>
          </div>
        </div>
      </DisplayDialog>
    );
  } else if (method.channel.toLowerCase() === "momo") {
    dialog = (
      <DisplayDialog
        title={method.channel}
        buttonText="Continue"
        open={open}
        handleClose={handleGuardedClose}
        sx={{
          backgroundColor: "#161D26",
          borderColor: "black",
          color: "white",
        }}
      >
        {method.image_url && (
          <div className="w-[250px] h-[250px] m-auto relative px-1 py-1 bg-white">
            <Image src={method.image_url} fill alt="payment qr code" />
          </div>
        )}

        <div>
          {isMomoLoading ? (
            <div className="flex justify-center items-center py-6">
              <MiniLoader />
            </div>
          ) : momoInitiated ? (
            <div className="text-center py-4">
              <div className="inline-flex items-start gap-3 p-4 rounded-lg bg-[#1f2a37] border border-green-700/40 text-left">
                <span className="mt-0.5 text-green-400">
                  <CheckedSvg />
                </span>
                <div>
                  <p className="text-green-400 text-sm lg:text-base font-semibold">
                    Payment initiated
                  </p>
                  <p className="text-gray-300 text-xs lg:text-sm mt-1">
                    Please authorize the payment on your phone to continue.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <MobilePaymentForm
              paymentMethod={momoPaymentMethod}
              phoneNumber={momoPhoneNumber}
              handleInput={handleMomoPaymentFormInput}
            />
          )}

          {(!isMomoLoading || momoInitiated) && (
            <div className="w-full flex justify-center mt-3">
              <GradientActionButton
                label={actionLabel}
                // isLoading={isMomoLoading && !momoInitiated}
                iconRight={<NextSvg />}
                onClick={handleMomoAction}
              />
            </div>
          )}
        </div>
      </DisplayDialog>
    );
  } else {
    dialog = (
      <DisplayDialog
        title={method.channel}
        buttonText="Continue"
        open={open}
        handleClose={() => setOpen(false)}
        sx={{
          backgroundColor: "#161D26",
          borderColor: "black",
          color: "white",
        }}
      >
        {method.image_url && (
          <div className="w-[250px] h-[250px] m-auto relative px-1 py-1 bg-white">
            <Image src={method.image_url} fill alt="payment qr code" />
          </div>
        )}
        <div>
          <p className="inline-block px-3 py-1 text-white rounded-lg">
            <span>{method.body}</span>
          </p>
        </div>
        <div>
          <p className="inline-block px-3 py-1 text-blue-600  rounded-lg">
            <span className="text-white">Name:</span> {method.sub_text}
          </p>

          <div className="w-full flex justify-center mt-3">
            <span
              className="text-white text-xs lg:text-sm px-4 py-1 bg-blue-500 cursor-pointer hover:bg-blue-900"
              onClick={handleNotifySeller}
            >
              Payment Sent
            </span>
          </div>
        </div>
      </DisplayDialog>
    );
  }

  return (
    <>
      <li className="cursor-pointer" onClick={handleClick}>
        <div
          className="space-y-3 py-6 lg:py-8 w-[180px] lg:w-[220px] bg-cover bg-center rounded-lg bg-white"
          style={{
            backgroundImage: `url(${methodImage})`,
          }}
        ></div>
      </li>
      {dialog}
    </>
  );
};

export default Payment;
