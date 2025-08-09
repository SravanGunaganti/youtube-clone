import { useLocation } from "react-router-dom";

export default function useActivePath() {
  const location = useLocation();
  return (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);
}
