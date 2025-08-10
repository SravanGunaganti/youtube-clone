import { Link } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import Overlay from "./Overlay";
import { sidebarLinks } from "../constants/sidebarLinks";
import { IoMdHome } from "react-icons/io";
import useActivePath from "../helpers/useActivePath";

const Sidebar = ({ isOpen, onClose }) => {
  // Using custom hook
  const isActivePath = useActivePath();

  return (
    <>
      <aside
        className={`fixed flex flex-col bg-white top-0 left-0 h-dvh w-60 
        text-gray-900  z-55 transform transition-transform ease-linear duration-200 ${
          isOpen
            ? "translate-x-0 block"
            : !isActivePath("/watch/", true)
            ? "xl:hidden -translate-x-full xl:translate-0"
            : "-translate-x-full"
        }`}>
        <div className="flex bg-white w-full items-center pl-4 h-14">
          <button
            onClick={() => {
              onClose();
            }}
            className="p-2 flex items-center border-none justify-center rounded-full hover:bg-gray-200">
            <HiOutlineBars3 size={24} />
          </button>
          {/* Logo */}
          <div className="flex-none relative">
            <img
              src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
              className="w-[93px] mx-[16px] my-[18px]"
            />
            <span className="text-[10px] absolute top-3 text-gray-500 right-1">
              IN
            </span>
          </div>
        </div>
        {/* Sidebar links */}
        <nav className="w-full scroll-smooth flex-1  p-3 overflow-y-auto overflow-x-hidden scroll-hover">
          <Link
            key={"/"}
            to={"/"}
            onClick={onClose}
            className={`flex items-center gap-3 mb-1 w-[calc(100%-12px)] px-3 py-2 rounded-lg text-black ${
              isActivePath("/", true)
                ? "bg-gray-100 hover:bg-gray-200"
                : "hover:bg-gray-100"
            }`}>
            <IoMdHome className="w-6 h-6" />
            <span className="text-sm">Home</span>
          </Link>
            {/* Sidebar links */}
          {sidebarLinks.map(({ section, links }, i) => (
            <div key={section || i} className="space-y-1">
              {section !== "Main" && (
                <h4 className="text-xs uppercase text-gray-500 px-2 pt-3">
                  {section}
                </h4>
              )}
              {links.map(({ to, label, icon: Icon }) => (
                <button
                  key={to}
                  onClick={onClose}
                  className={`flex items-center gap-3 w-[calc(100%-12px)] px-3 py-2 rounded-lg text-black ${
                    isActivePath(to, true)
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}>
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      {/* Overlay for smaller screens */}
      <div className={!isActivePath("/watch/", true) ? "xl:hidden" : ""}>
        {isOpen && <Overlay />}
      </div>
    </>
  );
};

export default Sidebar;
