"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import DisplayDialog from "../UI/Dialog/Dialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sendAdminEmail } from "@/utils/emailjs";
import { order } from "@/redux/features/orderSlice";
import MobilePaymentForm from "../Form/MobilePaymentForm";

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
      notifySeller();
      setOpen(false);
      sendAdminEmail(orderData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (paymentInitiated && method.channel.toLowerCase() === "usdt") {
      (async () => {
        const paymentDets = await makeUSDTPayment(id, setShowUsdtDialog);
        // console.log(paymentDets);

        setUsdtPaymentDetails(paymentDets);
      })();
    }
  }, [paymentInitiated]);

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
          <MobilePaymentForm
          // paymentMethod={method.payment_method}
          // phoneNumber={method.phone_number}
          />

          <div className="w-full flex justify-center mt-3">
            <span
              className="text-white text-xs lg:text-sm px-4 py-1 bg-blue-500 cursor-pointer hover:bg-blue-900"
              onClick={handleNotifySeller}
            >
              Make Payment
            </span>
          </div>
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
