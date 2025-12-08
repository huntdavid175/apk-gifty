import { NextResponse } from "next/server";
import axiosInstance from "@/utils/axios";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { user_id, title, messageBody, device_token, data } = body || {};

    if (!user_id || !title || !messageBody) {
      return NextResponse.json(
        { ok: false, message: "user_id, title and messageBody are required" },
        { status: 400 }
      );
    }

    const response = await axiosInstance({
      method: "POST",
      maxBodyLength: Infinity,
      url: `/send-notification`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        user_id,
        title,
        body: messageBody,
        device_token,
        data,
      },
    });

    // Forward upstream response
    if (typeof response.data === "object") {
      return NextResponse.json(response.data, { status: response.status });
    }
    return NextResponse.json(
      { ok: response.status < 400, raw: String(response.data) },
      { status: response.status }
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const raw = error?.response?.data;
    const data =
      typeof raw === "object"
        ? raw
        : {
            ok: false,
            message: "Failed to send",
            raw: raw ? String(raw) : null,
          };
    // eslint-disable-next-line no-console
    console.error("[SendNotification] Upstream error", status, data);
    return NextResponse.json(data, { status });
  }
}
