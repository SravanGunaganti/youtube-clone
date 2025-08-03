import { NavLink } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { RiHistoryFill } from "react-icons/ri";

const MiniSidebar = ({ isOpen = true }) => {
  const links = [
    { to: "/", label: "Home", icon: IoMdHome },
    { to: "/shots", label: "Shorts", icon: SiYoutubeshorts },
    { to: "/subscritions", label: "Subscriptions", icon: MdSubscriptions },
    { to: "/profile", label: "You", icon: CgProfile },
    { to: "/history", label: "History", icon: RiHistoryFill },
  ];

  return (
    <aside
      className={`fixed hidden md:block bg-white left-0 h-screen px-1 w-18 text-gray-900 z-30 transform transition-transform ease-linear duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }  justify-start`}>
      <div className="bg-white h-full max-w-full border-gray-200 flex flex-col md:rounded-xl justify-between">
        <nav className="flex w-full flex-col items-center h-dvh overflow-y-auto pt-15 scrollbar-hide">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={`flex w-full flex-col items-center justify-start
              gap-2 pt-4 pb-3.5 rounded-lg hover:bg-gray-100 text-black
                `}
              onClick={onClose}>
              <Icon className="w-6 h-6" />
              <span className="text-[10px]">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default MiniSidebar;
