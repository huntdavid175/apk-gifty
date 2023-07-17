interface Props {
  size?: "small" | "medium" | "large";
}

const WalletSvg: React.FC<Props> = ({ size }) => {
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
      <g id="Wallet-Icon" clipPath="url(#clip0_101_4122)">
        <path
          id="Vector"
          d="M18 7H21C21.2652 7 21.5196 7.10536 21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H18V7ZM4 9V19H20V9H4ZM4 5V7H16V5H4ZM15 13H18V15H15V13Z"
          fill="#F0F4F7"
        />
      </g>
      <defs>
        <clipPath id="clip0_101_4122">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default WalletSvg;
