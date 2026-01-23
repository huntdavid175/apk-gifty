import React from "react";
import { cookies } from "next/headers";

import FormInput from "@/components/Form/FormComponents/FormInput";

import KycIconSvg from "@/components/UI/SvgIcons/KycIconSvg";
import EyeIconSvg from "@/components/UI/SvgIcons/EyeIconSvg";
import EmailAtSvg from "@/components/UI/SvgIcons/EmailAtSvg";

import Link from "next/link";
import axiosInstance from "@/utils/axios";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";

const KYCPage = async () => {
  // const cookieStore = cookies();
  // const accessToken = cookieStore.get("access")?.value;

  let user: any = null;

  try {
    const res = await axiosInstance.get(`${process.env.API_ENDPOINT}/profile`, {
      headers: {
        //   Authorization: `Bearer ${accessToken}`,
      },
    });
    user = res.data?.data;
  } catch (error) {
    // ignore fetch errors
  }

  return (
    <div className="w-full text-white pb-32">
      <div className="w-full flex items-center justify-between pb-6 border-b-2 border-black">
        <p className="text-base font-semibold">My Profile</p>
      </div>

      <div className="mt-10">
        <p className="text-gray-400 ">Personal Information</p>
        <div className="flex flex-wrap justify-between gap-y-4 mt-6 ">
          <div className="w-full lg:w-[45%]">
            <FormInput
              icon={<KycIconSvg />}
              type="text"
              placeholder="First Name"
              name="firstname"
              className="bg-primary"
              defaultValue={user?.firstname ?? ""}
              readOnly
            />
          </div>
          <div className="w-full lg:w-[45%]">
            <FormInput
              icon={<KycIconSvg />}
              type="text"
              placeholder="Last Name"
              name="lastname "
              className="bg-primary"
              readOnly
            />
          </div>{" "}
          <div className="w-full lg:w-[45%]">
            <FormInput
              icon={<EyeIconSvg />}
              type="text"
              placeholder="Display Name"
              name="displayname"
              className="bg-primary"
              defaultValue={user?.firstname ?? ""}
              readOnly
            />
          </div>{" "}
          <div className="w-full lg:w-[45%]">
            <FormInput
              icon={<EmailAtSvg />}
              type="text"
              placeholder="User Name"
              name="username"
              className="bg-primary"
              defaultValue={user?.firstname ?? ""}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* <KYC status={user?.kyc?.status} /> */}
      {user && !user.kyc && (
        <div className="w-full flex justify-center mt-12">
          <Link href="/kyc">
            <button className="bg-appviolet text-white px-12 py-2 lg:px-16 lg:py-3 text-xs lg:text-sm rounded-lg hover:bg-[#597cf3]">
              Complete KYC
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
