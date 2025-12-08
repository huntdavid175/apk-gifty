"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { dashboardPageNavHandler } from "@/redux/features/mobileNavSlice";

import Iconcard from "@/components/Card/Iconcard";
import { User, Bell, ShoppingCart } from "lucide-react";
import LanguageSelect from "@/components/UI/LanguageSelect";
import NotificationSvg from "@/components/UI/SvgIcons/NotificationSvg";
import SettingsSvg from "@/components/UI/SvgIcons/SettingsSvg";
import WalletSvg from "@/components/UI/SvgIcons/WalletSvg";
import MenuButton from "@/components/UI/MenuButton";
import CartCountIcon from "./CartCountIcon";
import NotificationsDropdown from "./NotificationsDropDown";
import CartDropdown from "./CartDropDown";
import SendTestNotificationButton from "@/components/Dashboard/SendTestNotificationButton";

const Topbar = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const user: any = localStorage.getItem("userInfo");
    // console.log(JSON.parse(user));
    setUserInfo(JSON.parse(user));
  }, []);

  return (
    <div className="w-full px-6 py-4 fixed right-0 left-0 top-0 z-50 flex justify-between items-center bg-secondary border-b border-tertiary text-white">
      <div className="hidden lg:block">
        <Link href="/">
          <Image
            src={"/images/apklogo-new.png"}
            width={100}
            height={100}
            alt="apk logo"
          />
        </Link>
      </div>
      <div className="flex items-center gap-x-3 lg:hidden">
        <div className="">
          {/* <img
                  className="object-cover w-10 h-10 rounded-lg"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                  alt=""
                /> */}
          <Link
            href="/dashboard/settings/personal-information"
            className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-pink-400 rounded-full "
          >
            <span className="font-medium text-white">
              {userInfo?.firstname[0].toUpperCase()}
            </span>
          </Link>
        </div>
        <div>
          <p className="text-xs font-bold capitalize">{userInfo?.firstname}</p>
          {userInfo?.kyc && (
            <div className="flex justify-center items-center gap-x-1">
              <p className="text-xs text-gray-300">Verified</p>
              <Image
                src={"/images/verified.png"}
                width={20}
                height={20}
                alt="verified-badge"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="hidden lg:flex items-center gap-x-4">
          <LanguageSelect />
          <Link
            href="/dashboard/settings/personal-information"
            className="p-1.5 rounded-full hover:bg-gray-800"
          >
            <User className="h-5 w-5" />
          </Link>
          {/* <Link
            href="/notifications"
            className="p-1.5 rounded-full hover:bg-gray-800 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
          </Link> */}
          <NotificationsDropdown />
          <CartDropdown />
          {/* <CartCountIcon /> */}
          <SendTestNotificationButton />
        </div>
        {/* <Iconcard icon={<WalletSvg />} animate /> */}
        {/* <Iconcard icon={<SettingsSvg />} animate /> */}
        {/* <Iconcard icon={<NotificationSvg />} badgeData="8" animate /> */}
        <div className="lg:hidden flex items-center gap-x-4">
          {/* <Link
            href="/account"
            className="p-1.5 rounded-full hover:bg-gray-800"
          >
            <User className="h-5 w-5" />
          </Link> */}
          <NotificationsDropdown />
          <CartDropdown />
          {/* <CartCountIcon /> */}
          <MenuButton
            handleClick={() => dispatch(dashboardPageNavHandler(true))}
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
