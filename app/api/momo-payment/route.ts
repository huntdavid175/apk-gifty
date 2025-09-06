import axiosInstance from "@/utils/axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { id, paymentMethod, phoneNumber } = await body;

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `pay/${id}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Authorization: accessToken,
    },
    data: {
      paymentMode: paymentMethod,
      phoneNumber,
    },
  };

  try {
    const response = await axiosInstance(config);
    // console.log(response);
    return NextResponse.json(response.data);
  } catch (error: any) {
    // console.log(error);
    return new Response(
      JSON.stringify(
        error.response?.data ?? { message: "Payment initiation failed" }
      ),
      {
        status: error.response?.status ?? 500,
        headers: error.response?.header,
      }
    );
  }
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ message: "Missing id" }), {
      status: 400,
    });
  }

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `paymentstatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Authorization: accessToken,
    },
  } as const;

  try {
    const response = await axiosInstance(config);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        error.response?.data ?? { message: "Payment status check failed" }
      ),
      {
        status: error.response?.status ?? 500,
        headers: error.response?.header,
      }
    );
  }
}
