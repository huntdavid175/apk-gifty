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
import GradientActionButton from "../UI/GradientActionButton";

interface PaymentProps {
  method: any;
  makePayment?: any;
  id: number;
  loadingFunc?: any;
  notifySeller?: any;
  orderData: any;
  amountGhc?: number;
}

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

const makeCardPayment = async (id: number, loadingFunc: any, phoneNumber: string) => {
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
      paymentMethod: "CARD",
      phoneNumber,
    },
  };
  try {
    loadingFunc(true);
    const response = await axios(config);
    // eslint-disable-next-line no-console
    console.log("[CardPayment] Response:", response.status, response.data);
    if (response.status === 200) {
      toast.success("Payment initiated successfully");
      return response.data;
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("[CardPayment] Error:", error?.response?.data || error);
    toast.error("Payment issue, please try again later");
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

const Payment: React.FC<PaymentProps> = ({
  method,
  makePayment,
  id,
  loadingFunc,
  notifySeller,
  orderData,
  amountGhc,
}) => {
  const [open, setOpen] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [usdtPaymentDetails, setUsdtPaymentDetails] = useState<any>(null);
  const [showUsdtDialog, setShowUsdtDialog] = useState(false);
  const [isUsdtLoading, setIsUsdtLoading] = useState(false);
  const [momoPaymentMethod, setMomoPaymentMethod] =
    useState<string>("MTN_MONEY");
  const [momoPhoneNumber, setMomoPhoneNumber] = useState<string>("");
  const [isMomoLoading, setIsMomoLoading] = useState<boolean>(false);
  const [momoInitiated, setMomoInitiated] = useState<boolean>(false);
  const [momoPaid, setMomoPaid] = useState<boolean>(false);
  const [isCardLoading, setIsCardLoading] = useState<boolean>(false);
  const [cardPhoneNumber, setCardPhoneNumber] = useState<string>("");

  let dialog;

  const handleClick = (e: any) => {
    if (method.channel.toLowerCase() === "usdt") {
      setPaymentInitiated(true);
      setShowUsdtDialog(true);
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
    if (!momoInitiated && momoPhoneNumber.trim() === "") {
      toast.warn("Please enter your phone number to continue.");
      return;
    }
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
        const paymentDets = await makeUSDTPayment(id, setIsUsdtLoading);
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
    dialog = (
      <DisplayDialog
        title={""}
        buttonText={""}
        open={showUsdtDialog}
        handleClose={() => setShowUsdtDialog(false)}
        sx={{
          backgroundColor: "#f5f7fb",
          borderColor: "transparent",
          color: "#0b1520",
        }}
        maxWidthProp="sm"
        paperSx={{ width: 520 }}
      >
        {isUsdtLoading || !usdtPaymentDetails ? (
          <div className="flex justify-center items-center py-6">
            <MiniLoader />
          </div>
        ) : (
          <div className="space-y-5 text-[#0b1520]">
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#e6eef9] flex items-center justify-center">
                <span className="text-3xl">₮</span>
              </div>
              <h3 className="mt-3 text-[26px] font-semibold">
                Pay With Crypto(USDT)
              </h3>
            </div>

            {/* Amount box */}
            <div className="bg-[#e9f0f8] rounded-xl px-6 py-5 text-center">
              <p className="text-sm opacity-70">
                Send exactly this amount in USDT:
              </p>
              <p className="text-3xl lg:text-4xl font-extrabold mt-2 text-[#0b1520]">
                ₵{(amountGhc ?? usdtPaymentDetails?.amount ?? 0).toFixed(2)}
              </p>
            </div>

            {/* Wallet box */}
            <div className="rounded-xl border border-[#e9f0f8] bg-[#e9f0f8] px-4 py-4 text-sm">
              <p className="text-center font-medium mb-2">
                Send to this address
              </p>
              <div className="bg-[#e9f0f8] rounded-lg border border-[#e9f0f8] px-3 py-3 w-full max-w-[420px] mx-auto">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[12px] text-[#5b6b7f]">Wallet :</span>
                  <span className="text-sm font-semibold text-[#0b1520] break-all">
                    {usdtPaymentDetails.payment_address}
                  </span>
                  <button
                    className="text-blue-500"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        String(usdtPaymentDetails.payment_address)
                      )
                    }
                    aria-label="Copy wallet address"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="#"
                className="text-blue-500 text-sm font-semibold underline"
              >
                What to do next?
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#0b1520]">
              <span className="text-xl">🕒</span>
              <span className="text-sm lg:text-base">Payment expires in:</span>
              <span className="text-[#e53935] font-semibold ml-2">
                {/* dynamic countdown can be passed in */}
              </span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                className="px-8 py-3 rounded-2xl bg-[#1a73e8] hover:bg-[#155fc0] text-white font-semibold"
                onClick={handleNotifySeller}
              >
                Paid
              </button>
              <button
                className="text-[#5b6b7f] hover:text-[#0b1520] underline text-sm"
                onClick={() => setShowUsdtDialog(false)}
              >
                Cancel order
              </button>
            </div>
          </div>
        )}
      </DisplayDialog>
    );
  } else if (method.channel.toLowerCase() === "momo") {
    dialog = (
      <DisplayDialog
        title={""}
        buttonText={""}
        open={open}
        handleClose={handleGuardedClose}
        sx={{
          backgroundColor: "#f5f7fb",
          borderColor: "transparent",
          color: "#0b1520",
        }}
        maxWidthProp="sm"
        paperSx={{ width: 520 }}
      >
        <div className="space-y-5 text-[#0b1520]">
          <div className="w-full flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#e6eef9] flex items-center justify-center text-2xl">
              📱
            </div>
            <h3 className="mt-3 text-[26px] font-semibold">
              Pay With Ghana Cedis (MoMo)
            </h3>
          </div>

          <div className="bg-[#e9f0f8] rounded-xl px-6 py-5 text-center">
            <p className="text-sm opacity-70">
              Send exactly this amount in GHC:
            </p>
            <p className="text-3xl lg:text-4xl font-extrabold mt-2 text-[#0b1520]">
              ₵{(amountGhc ?? orderData?.price ?? 0).toFixed(2)}
            </p>
          </div>

          {isMomoLoading ? (
            <div className="flex justify-center items-center py-6">
              <MiniLoader />
            </div>
          ) : momoInitiated ? (
            <div className="text-center py-2">
              <div className="inline-flex items-start gap-3 p-4 rounded-lg bg-[#e6eef9] border border-green-700/20 text-left">
                <span className="mt-0.5 text-green-600">
                  <CheckedSvg />
                </span>
                <div>
                  <p className="text-green-700 text-sm lg:text-base font-semibold">
                    Payment initiated
                  </p>
                  <p className="text-[#0b1520] text-xs lg:text-sm mt-1 opacity-80">
                    Please authorize the payment on your phone to continue.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#e9f0f8] bg-[#e9f0f8] px-4 py-4">
              <MobilePaymentForm
                paymentMethod={momoPaymentMethod}
                phoneNumber={momoPhoneNumber}
                handleInput={handleMomoPaymentFormInput}
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-6">
            <button
              className={`px-8 py-3 rounded-2xl font-semibold text-white ${
                !momoInitiated && momoPhoneNumber.trim().length === 0
                  ? "bg-gray-300 cursor-not-allowed opacity-60"
                  : "bg-[#1a73e8] hover:bg-[#155fc0]"
              }`}
              onClick={handleMomoAction}
              disabled={!momoInitiated && momoPhoneNumber.trim().length === 0}
              aria-disabled={
                !momoInitiated && momoPhoneNumber.trim().length === 0
              }
            >
              {actionLabel}
            </button>
            <button
              className="text-[#5b6b7f] hover:text-[#0b1520] underline text-sm"
              onClick={handleGuardedClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </DisplayDialog>
    );
  } else if (method.channel.toLowerCase() === "card") {
    dialog = (
      <DisplayDialog
        title={""}
        buttonText={""}
        open={open}
        handleClose={() => setOpen(false)}
        sx={{
          backgroundColor: "#f5f7fb",
          borderColor: "transparent",
          color: "#0b1520",
        }}
        maxWidthProp="sm"
        paperSx={{ width: 520 }}
      >
        <div className="space-y-5 text-[#0b1520]">
          <div className="w-full flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#e6eef9] flex items-center justify-center text-3xl">
              💳
            </div>
            <h3 className="mt-3 text-[26px] font-semibold">
              Pay With Visa / Mastercard
            </h3>
          </div>

          <div className="bg-[#e9f0f8] rounded-xl px-6 py-5 text-center">
            <p className="text-sm opacity-70">Amount to pay:</p>
            <p className="text-3xl lg:text-4xl font-extrabold mt-2 text-[#0b1520]">
              ₵{(amountGhc ?? orderData?.price ?? 0).toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-[#e9f0f8] bg-[#e9f0f8] px-4 py-5 text-center">
            <p className="text-sm text-[#0b1520]">
              Make payment with your Visa or Mastercard. You will be redirected
              to a secure payment page.
            </p>
          </div>

          <div className="rounded-xl border border-[#e9f0f8] bg-[#e9f0f8] px-4 py-4">
            <div className="space-y-2">
              <label htmlFor="cardPhoneNumber" className="text-xs text-[#5b6b7f]">
                Phone Number
              </label>
              <input
                id="cardPhoneNumber"
                type="tel"
                placeholder="Enter mobile number"
                value={cardPhoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                  setCardPhoneNumber(val);
                }}
                inputMode="numeric"
                maxLength={10}
                className="w-full bg-white text-[#0b1520] text-sm rounded-lg px-3 py-2.5 border border-[#dde6f2] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition"
              />
              <p className="text-[11px] text-[#5b6b7f]">
                Enter the phone number to receive payment confirmation.
              </p>
            </div>
          </div>

          {isCardLoading ? (
            <div className="flex justify-center items-center py-6">
              <MiniLoader />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <button
                className={`px-8 py-3 rounded-2xl font-semibold text-white ${
                  cardPhoneNumber.trim().length === 0
                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                    : "bg-[#1a73e8] hover:bg-[#155fc0]"
                }`}
                onClick={async () => {
                  if (cardPhoneNumber.trim().length === 0) return;
                  const res = await makeCardPayment(id, setIsCardLoading, cardPhoneNumber);
                  if (res) {
                    // Payment initiated successfully
                  }
                }}
                disabled={cardPhoneNumber.trim().length === 0}
              >
                Proceed to Pay
              </button>
              <button
                className="text-[#5b6b7f] hover:text-[#0b1520] underline text-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </DisplayDialog>
    );
  } else {
    console.log(method);
    const bankName =
      method?.body.split(" ")[0] + " " + method?.body.split(" ")[1];
    const accountNumber = method?.body.split(" ")[2];
    const accountName =
      method?.sub_text.split(" ")[0] +
      " " +
      method?.sub_text.split(" ")[1] +
      " " +
      method?.sub_text.split(" ")[2];
    dialog = (
      <DisplayDialog
        title={""}
        buttonText={""}
        open={open}
        handleClose={() => setOpen(false)}
        sx={{
          backgroundColor: "#f5f7fb",
          borderColor: "transparent",
          color: "#0b1520",
        }}
        maxWidthProp="sm"
        paperSx={{ width: 520 }}
      >
        <div className="space-y-5 text-[#0b1520]">
          <div className="w-full flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#e6eef9] flex items-center justify-center text-2xl">
              🏦
            </div>
            <h3 className="mt-3 text-[26px] font-semibold">Pay With Bank</h3>
          </div>

          {/* Amount box */}
          <div className="bg-[#e9f0f8] rounded-xl px-6 py-5 text-center">
            <p className="text-sm opacity-70">Send exactly this amount:</p>
            <p className="text-3xl lg:text-4xl font-extrabold mt-2 text-[#0b1520]">
              ₵{(amountGhc ?? orderData?.price ?? 0).toFixed(2)}
            </p>
          </div>

          {/* Bank details */}
          <div className="rounded-xl border border-[#e9f0f8] bg-[#e9f0f8] px-4 py-4 text-sm">
            <p className="font-medium text-center mb-3">Bank Details:</p>
            <div className="space-y-3 flex flex-col items-center">
              <div className="bg-white rounded-lg border border-[#dde6f2] px-3 py-3 w-full max-w-[340px]">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[12px] text-[#5b6b7f] text-center">
                    Account Number
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#0b1520] break-all text-center">
                      {accountNumber}
                    </p>
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        navigator.clipboard.writeText(String(accountNumber))
                      }
                      aria-label="Copy account number"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#dde6f2] px-3 py-3 w-full max-w-[340px]">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[12px] text-[#5b6b7f] text-center">
                    Account Name
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#0b1520] break-words text-center">
                      {accountName}
                    </p>
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        navigator.clipboard.writeText(String(accountName))
                      }
                      aria-label="Copy account name"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#dde6f2] px-3 py-3 w-full max-w-[340px]">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[12px] text-[#5b6b7f] text-center">
                    Bank Name
                  </p>
                  <p className="text-sm text-[#0b1520] break-words text-center">
                    {bankName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#"
              className="text-blue-500 text-sm font-semibold underline"
            >
              What to do next?
            </a>
          </div>

          {/* Expiry */}
          <div className="flex items-center justify-center gap-2 text-[#0b1520]">
            <span className="text-xl">🕒</span>
            <span className="text-sm lg:text-base">Payment expires in:</span>
            <span className="text-[#e53935] font-semibold ml-2">
              {/* dynamic countdown can be passed in */}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-6">
            <button
              className="px-8 py-3 rounded-2xl bg-[#1a73e8] hover:bg-[#155fc0] text-white font-semibold"
              onClick={handleNotifySeller}
            >
              Paid
            </button>
            <button
              className="text-[#5b6b7f] hover:text-[#0b1520] underline text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel order
            </button>
          </div>
        </div>
      </DisplayDialog>
    );
  }

  const displayLabel =
    method.channel.toLowerCase() === "usdt"
      ? "Pay with Crypto(USDT)"
      : method.channel.toLowerCase() === "momo"
      ? "Pay with Ghana Cedis(Momo)"
      : method.channel.toLowerCase() === "bank"
      ? "Pay with Bank"
      : method.channel.toLowerCase() === "card"
      ? "Pay with Visa/Mastercard"
      : `Pay with ${method.channel}`;

  return (
    <>
      <li className="cursor-pointer w-full" onClick={handleClick}>
        <div className="w-full flex items-center justify-between px-5 py-5 rounded-xl bg-[#1f2a37] border border-[#2a3441] hover:bg-[#232c38] transition">
          <span className="text-white text-sm lg:text-base">
            {displayLabel}
          </span>
          <span className="h-5 w-5 rounded-full border-2 border-gray-400" />
        </div>
      </li>
      {dialog}
    </>
  );
};

export default Payment;
