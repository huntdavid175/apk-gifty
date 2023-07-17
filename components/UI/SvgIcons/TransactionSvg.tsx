interface Props {
  size?: "small" | "medium" | "large";
}

const TransactionSvg: React.FC<Props> = ({ size }) => {
  let iconSize;

  switch (size) {
    case "small":
      iconSize = "w-5 h-5";
      break;
    case "medium":
      iconSize = "w-8 h-8";
      break;
    case "large":
      iconSize = "w-12 h-12";
      break;
  }
  return (
    <svg
      className={`${size ? iconSize : "w-5 h-5"}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Transaction-Icon" clipPath="url(#clip0_101_4153)">
        <path
          id="Vector"
          d="M19.3741 15.103C20.0229 13.5613 20.1723 11.855 19.8011 10.224C19.43 8.59303 18.557 7.11938 17.305 6.01024C16.0529 4.9011 14.4847 4.21225 12.8209 4.04055C11.1571 3.86884 9.48124 4.22292 8.02906 5.05299L7.03706 3.31599C8.5547 2.4486 10.2733 1.99435 12.0213 1.99856C13.7693 2.00278 15.4856 2.4653 16.9991 3.33999C21.4891 5.93199 23.2091 11.482 21.1161 16.11L22.4581 16.884L18.2931 19.098L18.1281 14.384L19.3741 15.103V15.103ZM4.62406 8.89699C3.97521 10.4387 3.82585 12.145 4.19698 13.776C4.56811 15.4069 5.44108 16.8806 6.69314 17.9897C7.9452 19.0989 9.51338 19.7877 11.1772 19.9594C12.8411 20.1311 14.5169 19.7771 15.9691 18.947L16.9611 20.684C15.4434 21.5514 13.7249 22.0056 11.9769 22.0014C10.2288 21.9972 8.5125 21.5347 6.99906 20.66C2.50906 18.068 0.789062 12.518 2.88206 7.88999L1.53906 7.11699L5.70406 4.90299L5.86906 9.61699L4.62306 8.89799L4.62406 8.89699ZM13.4141 14.828L10.5831 12L7.75506 14.828L6.34106 13.414L10.5841 9.17199L13.4131 12L16.2421 9.17199L17.6561 10.586L13.4131 14.828H13.4141Z"
          fill="#F0F4F7"
        />
      </g>
      <defs>
        <clipPath id="clip0_101_4153">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TransactionSvg;
