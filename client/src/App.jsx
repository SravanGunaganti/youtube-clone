import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar.jsx";
import MiniSidebar from "./components/MiniSidebar.jsx";
import "./index.css";
import { useState } from "react";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  const isActivePath = (path, exact = false) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-full top-0 right-0 left-0.5 absolute  overflow-hidden  bg-white text-black ">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="relative h-full">
        <MiniSidebar
          hideLabels={hideLabels}
          handleLabels={handleLabels}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          className={`h-full ${
            isActivePath("/", true) && isSidebarOpen
              ? "md:pl-18 xl:pl-60"
              : "md:pl-18"
          } pt-14 px-3`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
