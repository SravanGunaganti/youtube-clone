import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions, MdVideoLibrary, MdHistory } from "react-icons/md";
import { FaClock, FaThumbsUp, FaStar, FaFilm, FaGamepad, FaCog, FaQuestionCircle } from "react-icons/fa";
import { RiHistoryFill } from "react-icons/ri";


export const sidebarLinks = [
  {
    section: "Main",
    links: [
      // { to: "/", label: "Home", icon: IoMdHome },
      { to: "/shorts", label: "Shorts", icon: SiYoutubeshorts },
      { to: "/subscriptions", label: "Subscriptions", icon: MdSubscriptions },
    ],
  },
  {
    section: "Library",
    links: [
      { to: "/library", label: "Library", icon: MdVideoLibrary },
      { to: "/history", label: "History", icon: RiHistoryFill },
      { to: "/watch-later", label: "Watch Later", icon: FaClock },
      { to: "/liked-videos", label: "Liked Videos", icon: FaThumbsUp },
    ],
  },
  {
    section: "More from YouTube",
    links: [
      { to: "/premium", label: "YouTube Premium", icon: FaStar },
      { to: "/movies", label: "Movies & Shows", icon: FaFilm },
      { to: "/gaming", label: "Gaming", icon: FaGamepad },
    ],
  },
  {
    section: "Settings",
    links: [
      { to: "/settings", label: "Settings", icon: FaCog },
      { to: "/help", label: "Help", icon: FaQuestionCircle },
    ],
  },
  
];
