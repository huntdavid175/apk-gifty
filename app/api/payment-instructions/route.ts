import axiosInstance from "@/utils/axios";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const body = await req.json();

  // console.log(body);

  const { id } = await body;

  // console.log(body);

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/api/paymentInstructions",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Authorization: accessToken,
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
