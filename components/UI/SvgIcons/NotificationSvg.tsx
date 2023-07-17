interface Props {
  size?: "small" | "medium" | "large";
}

const NotificationSvg: React.FC<Props> = ({ size }) => {
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
      <g id="Notification-Icon">
        <path
          id="Vector"
          d="M5 18H19V11.031C19 7.148 15.866 4 12 4C8.134 4 5 7.148 5 11.031V18ZM12 2C16.97 2 21 6.043 21 11.031V20H3V11.031C3 6.043 7.03 2 12 2ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21V21Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export default NotificationSvg;
