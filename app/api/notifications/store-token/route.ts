import axiosInstance from "@/utils/axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const token = body?.token ?? body?.device_token;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { ok: false, message: "token is required" },
        { status: 400 }
      );
    }

    const response = await axiosInstance({
      method: "POST",
      maxBodyLength: Infinity,
      url: `/store-token`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        device_token: token,
      },
    });

    // Forward the upstream response
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? {
      ok: false,
      message: "Failed to store token",
    };
    // eslint-disable-next-line no-console
    console.error("[StoreToken] Upstream error", status, data);
    return NextResponse.json(data, { status });
  }
}
