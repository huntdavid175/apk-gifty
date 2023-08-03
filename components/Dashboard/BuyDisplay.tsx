"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import CheckedSvg from "@/components/UI/SvgIcons/CheckedSvg";
import Toggle from "@/components/UI/Toggle";
import BuyAmountInput from "../Form/FormComponents/BuyAmountInput";
import LockSvg from "@/components/UI/SvgIcons/LockSvg";
import BasicSelect from "../Form/FormComponents/BasicSelect";
import ConfirmationSelect from "../Form/FormComponents/ConfirmationSelect";
import FilterSelectOutline from "../Filter/FilterSelectOutline";

interface Props {
  canCustom: string;
  id: string;
  price: string;
  accessToken: string | undefined;
}

const BuyDisplay: React.FC<Props> = ({ canCustom, id, accessToken, price }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState("1");
  const handleQuantity = (e: any) => {
    const value = e.target.value;

    setQuantity(value);
  };

  const buyHandler = async () => {
    console.log(id);
    const data = {
      quantity: quantity,
      product_id: id,
    };
    const config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "/api/order",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };
    try {
      const response = await axios(config);
      console.log(response.data);
      router.push(`/exchange/confirm-order/hsdhsg?id=${response.data.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      <div className="flex justify-between">
        <h3 className="text-xl">Buy in Custom Amount</h3>

        <Toggle isChecked={Number(canCustom) === 0 ? false : true} />
      </div>
      <hr className="border-t border-gray-600 "></hr>
      <div className="px-6 py-6 border-2 border-gray-600 rounded-lg space-y-2">
        <div className="w-full  flex gap-x-2">
          <div className="">
            <CheckedSvg />
          </div>

          <p>Get all knowledge how to deal in gift cards</p>
        </div>
        <div className="w-full  flex gap-x-2">
          <div>
            <CheckedSvg />
          </div>

          <p>Best trading techniques</p>
        </div>
        <div className="flex gap-x-2">
          <div>
            <CheckedSvg />
          </div>
          <p>Increase Profits</p>
        </div>
      </div>
      <div className="px-12 py-8 bg-[#23262F] rounded-xl  text-center space-y-6">
        <div>
          <BasicSelect
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            handleSelect={handleQuantity}
          />

          {/* 
          <BuyAmountInput
            isFixedPrice={Number(canCustom) === 0 ? false : true}
          /> */}
        </div>
        <div>
          <p className="font-light">You have to pay</p>
          <p className="text-3xl font-semibold text-[#587BF2]">
            ${Number(quantity) * Number(price)}
          </p>
        </div>
      </div>
      <div className="flex gap-x-3 items-center">
        <div className="p-3 rounded-full border border-gray-600">
          <LockSvg />
        </div>
        {/* <Link href={"/exchange/confirm-order"} className=" w-full"> */}
        <button
          onClick={buyHandler}
          type="button"
          className="w-full rounded-xl bg-[#587BF2] relative text-sm px-2 py-2  flex justify-center items-center lg:py-3 lg:text-base hover:bg-[#4366d7]"
        >
          Buy The Gift Card
        </button>
        {/* </Link> */}
      </div>{" "}
    </>
  );
};

export default BuyDisplay;