"use client";

import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

// 6LeYiB0oAAAAAKkfO-EPiqTPiIvwl2z3cBGub3V6

interface Props {
  onChange: () => void;
  onExpired: () => void;
}

const ReCaptchaWrapper: React.FC<Props> = ({ onChange, onExpired }) => {
  return (
    <ReCAPTCHA
      // sitekey="6LeYiB0oAAAAAKkfO-EPiqTPiIvwl2z3cBGub3V6"
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      onChange={onChange}
      onExpired={onExpired}
    />
  );
};

export default ReCaptchaWrapper;
