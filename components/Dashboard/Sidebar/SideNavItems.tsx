import DashboardSvg from "../../UI/SvgIcons/DashboardSvg";
import ExchangeSvg from "../../UI/SvgIcons/ExchangeSvg";
import NewsSvg from "../../UI/SvgIcons/NewsSvg";
import SettingsSvg from "../../UI/SvgIcons/SettingsSvg";
import TransactionSvg from "../../UI/SvgIcons/TransactionSvg";
import WalletSvg from "../../UI/SvgIcons/WalletSvg";
import SideNavItem from "./SideNavItem";

interface Props {
  links: any;
}

const links = [
  { title: "Dashboard", url: "/", icon: <DashboardSvg /> },
  { title: "Exchange", url: "/exchange/buy", icon: <ExchangeSvg /> },
  { title: "Wallet", url: "#", icon: <WalletSvg /> },
  { title: "Transaction", url: "#", icon: <TransactionSvg /> },
  { title: "Settings", url: "#", icon: <SettingsSvg /> },
  { title: "News", url: "#", icon: <NewsSvg /> },
];

const SideNavItems = () => {
  return (
    <>
      <nav className="-mx-3 space-y-3 ">
        {links.map((link) => (
          <SideNavItem
            key={link.url}
            title={link.title}
            url={link.url}
            icon={link.icon}
          />
        ))}
      </nav>
    </>
  );
};
export default SideNavItems;
