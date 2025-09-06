"use client";

import FormInput from "./FormComponents/FormInput";
import PhoneSvg from "../UI/SvgIcons/PhoneSvg";
import DropIcon from "../UI/SvgIcons/DropIcon";

const paymentMethods = [
  {
    label: "MTN Mobile Money",
    value: "MTN_MONEY",
  },
  {
    label: "Vodafone Cash",
    value: "VODAFONE_CASH",
  },
  {
    label: "Airtel/Tigo Money",
    value: "AIRTELTIGO_MONEY",
  },
];

export default function MobilePaymentForm() {
  return (
    <div className="text-white space-y-5">
      <p className="text-lg font-semibold">Enter Mobile Money Details</p>

      <div className="space-y-2">
        <label htmlFor="paymentMethod" className="text-xs text-gray-300">
          Payment Method
        </label>
        <div className="relative">
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="w-full appearance-none bg-[#23262F] text-white text-sm rounded-lg px-3 py-2.5 pr-10 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue={paymentMethods[0].value}
            aria-label="Select payment method"
          >
            {paymentMethods.map((method) => (
              <option value={method.value} key={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <DropIcon />
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="text-xs text-gray-300">
          Phone Number
        </label>
        <FormInput
          type="tel"
          placeholder="Enter mobile number"
          icon={<PhoneSvg />}
          name="phoneNumber"
          inputMode="numeric"
          maxLength={10}
          htmlPattern="^\\d{10}$"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^0-9]/g, "").slice(0, 10);
          }}
          className="bg-[#23262F] rounded-lg px-3 py-2.5 border border-transparent focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition"
        />
        <p className="text-[11px] text-gray-400">
          Use the number registered with your wallet.
        </p>
      </div>
    </div>
  );
}
