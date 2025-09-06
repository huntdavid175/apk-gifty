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
    return new Response(JSON.stringify(error.response.data), {
      status: error.response.status,
      headers: error.response.header,
    });
  }
}

export async function GET(req: Request, res: Response) {
  const { id } = await req.json();

  const response = await axiosInstance.get(`/pay/${id}`);
  return NextResponse.json(response.data);
}
