interface Props {
  size?: "small" | "medium" | "large";
}

const InboxSvg: React.FC<Props> = ({ size }) => {
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
      <g id="Chat-Icon" clipPath="url(#clip0_101_4134)">
        <path
          id="Vector"
          d="M10 3H14C16.1217 3 18.1566 3.84285 19.6569 5.34315C21.1571 6.84344 22 8.87827 22 11C22 13.1217 21.1571 15.1566 19.6569 16.6569C18.1566 18.1571 16.1217 19 14 19V22.5C9 20.5 2 17.5 2 11C2 8.87827 2.84285 6.84344 4.34315 5.34315C5.84344 3.84285 7.87827 3 10 3V3ZM12 17H14C14.7879 17 15.5681 16.8448 16.2961 16.5433C17.0241 16.2417 17.6855 15.7998 18.2426 15.2426C18.7998 14.6855 19.2417 14.0241 19.5433 13.2961C19.8448 12.5681 20 11.7879 20 11C20 10.2121 19.8448 9.43185 19.5433 8.7039C19.2417 7.97595 18.7998 7.31451 18.2426 6.75736C17.6855 6.20021 17.0241 5.75825 16.2961 5.45672C15.5681 5.15519 14.7879 5 14 5H10C8.4087 5 6.88258 5.63214 5.75736 6.75736C4.63214 7.88258 4 9.4087 4 11C4 14.61 6.462 16.966 12 19.48V17Z"
          fill="#F0F4F7"
        />
      </g>
      <defs>
        <clipPath id="clip0_101_4134">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InboxSvg;
