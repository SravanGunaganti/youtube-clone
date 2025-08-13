import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import MiniSidebar from "./components/MiniSidebar.jsx";
import "./index.css";
import { useState, createContext, useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useActivePath from "./helpers/useActivePath.js";

// Created context to pass data between components
export const NavContext = createContext({});

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  // useLocation hook
  const location = useLocation();
  // custom hook to check active path
  const isActivePath = useActivePath();

  // function to handle search
  const handleSearch = (query) => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    setSearchQuery(query);
  };

  // useEffect hook for route change handling and scrolling to top of the page on route change
  useEffect(() => {
    handleRouteChange();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // function to handle route change
  const handleRouteChange = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    if (showProfile) {
      setShowProfile(false);
    }
  };

  const handleHideMenus = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    if (showProfile) {
      setShowProfile(false);
    }
  }
  useEffect(() => {
    document.getElementsByTagName("main")[0].addEventListener("click", handleHideMenus);

    return () => {
      document.getElementsByTagName("main")[0].removeEventListener("click", handleHideMenus);
    };
  }, [isSidebarOpen, showProfile]);
  return (
    // context provider
    <NavContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isActivePath,
        searchQuery,
        handleSearch,
        showProfile,
        setShowProfile,
      }}>
      <div className="min-h-screen top-0 right-0 left-0 absolute  overflow-hidden  bg-white text-black ">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSearch={handleSearch}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        {!isActivePath("/watch/") && (
          <MiniSidebar onClose={() => setIsSidebarOpen(false)} />
        )}
        <div className="relative h-full overflow-y-scroll">
          <main
            className={`h-full ${
              !isActivePath("/watch/") && isSidebarOpen
                ? "md:pl-18 xl:pl-60"
                : "md:pl-18"
            } pt-14 md:px-3`}>
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        limit={1}
        closeOnClick
        rtl={false}
      />
    </NavContext.Provider>
  );
}
