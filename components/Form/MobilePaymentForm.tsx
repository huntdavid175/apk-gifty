"use client";

import PaymentFormInput from "./FormComponents/PaymentFormInput";
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

export default function MobilePaymentForm({
  paymentMethod,
  phoneNumber,
  handleInput,
}: {
  paymentMethod: string;
  phoneNumber: string;
  handleInput: (e: any) => void;
}) {
  return (
    <div className="text-[#0b1520] space-y-5">
      <p className="text-lg font-semibold">Enter Mobile Money Details</p>

      <div className="space-y-2">
        <label htmlFor="paymentMethod" className="text-xs text-[#5b6b7f]">
          Payment Method
        </label>
        <div className="relative">
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="w-full appearance-none bg-white text-[#0b1520] text-sm rounded-lg px-3 py-2.5 pr-10 border border-[#dde6f2] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition"
            defaultValue={paymentMethod}
            aria-label="Select payment method"
            onChange={handleInput}
          >
            {paymentMethods.map((method) => (
              <option value={method.value} key={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5b6b7f]">
            <DropIcon />
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="text-xs text-[#5b6b7f]">
          Phone Number
        </label>
        <PaymentFormInput
          type="tel"
          placeholder="Enter mobile number"
          icon={<PhoneSvg color="#0b1520" />}
          name="phoneNumber"
          defaultValue={phoneNumber}
          handleInput={handleInput}
          inputMode="numeric"
          maxLength={10}
          htmlPattern="^\\d{10}$"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^0-9]/g, "").slice(0, 10);
          }}
          className="bg-white rounded-lg px-3 py-2.5 border border-[#dde6f2] focus-within:ring-2 focus-within:ring-[#1a73e8] focus-within:border-[#1a73e8] transition"
        />
        <p className="text-[11px] text-[#5b6b7f]">
          Use the number registered with your wallet.
        </p>
      </div>
    </div>
  );
}
