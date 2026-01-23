import axios from "axios";
import { cookies } from "next/headers";
import axiosInstance from "@/utils/axios";

import ConfirmOrder from "@/components/Clients/ConfirmOrder";
import AdminOffline from "@/components/Clients/AdminOffline";

const fetchOrder = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/order/${id}`, {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });
    // console.log("order", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.API_ENDPOINT}/paymentInstructions`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("[PaymentMethods] Response:");
    // console.dir(response.data, { depth: null });
    return response.data;
  } catch (error) {
    // console.log(error);
  }
};

const fetchRate = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.API_ENDPOINT}/setting`
    );
    // console.log("rate", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const ConfirmOrderPage = async ({ searchParams }: { searchParams: any }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access")?.value;
  const id = searchParams.pid;
  let orderData, paymentMethods, rate, updatedOrderData;
  // const category = searchParams.category;
  // console.log("Full searchParams object:", searchParams);
  // console.log("searchParams id:", id);

  if (!id) {
    throw new Error("No order with that id");
  }

  if (id) {
    [orderData, paymentMethods, rate] = await Promise.all([
      fetchOrder(id),
      fetchPaymentMethods(),
      fetchRate(),
    ]);

    updatedOrderData = {
      ...orderData.data,
      category: orderData.data.category_name,
    };
  }

  // console.log(rate.data[0]);

  // console.log(orderData);
  // console.log(paymentMethods);
  // const { price, processing_end_time, status } = orderData?.data;
  // console.log(orderData?.data.status);
  // console.log(Number(orderData.data.status) < 2);
  // const status = orderData.data.status;

  const adminOnline = rate.data[0]?.admin_online;

  const currentHour = new Date().getUTCHours();
  const startHour = 6; // 6am
  const endHour = 20; // 8pm

  if (
    (updatedOrderData.category === "Bundle" ||
      updatedOrderData.category === "Bank") &&
    !(currentHour >= startHour && currentHour < endHour)
  ) {
    return (
      <div className="w-full bg-secondary px-4 flex flex-col  text-white pb-32 lg:flex-row items-center justify-center lg:px-0 lg:h-screen lg:pb-0 lg:overflow-hidden">
        <p className="text-center text-xl lg:text-2xl text-appviolet font-semibold">
          We are Closed Now. Please Check Back at 6AM.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary px-4 flex flex-col  text-white pb-32 lg:flex-row lg:px-0 lg:h-screen lg:pb-0 lg:overflow-hidden">
      {adminOnline === "1" && (
        <ConfirmOrder
          token={accessToken!}
          orderData={updatedOrderData}
          paymentMethods={paymentMethods.data}
          rate={rate.data[0].rate}
        />
      )}
      {adminOnline === "0" && <AdminOffline />}

      {/* {orderData?.data.status === "2" ||
        (orderData?.data.status === "-1" && (
          <EndedOrder orderData={orderData} />
        ))} */}
    </div>
  );
};

export default ConfirmOrderPage;
