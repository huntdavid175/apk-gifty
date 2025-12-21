import axiosInstance from "@/utils/axios";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
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
      method: "GET",
      maxBodyLength: Infinity,
      url: `/notification`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Forward the upstream response
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? {
      ok: false,
      message: "Failed to get notifications",
    };
    // eslint-disable-next-line no-console
    console.error("[GetNotifications] Upstream error", status, data);
    return NextResponse.json(data, { status });
  }
}
