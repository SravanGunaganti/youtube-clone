function formatNumber(number) {
    if (number < 1000) return `${number}`;
    if (number < 1_000_000) return `${(number / 1000).toFixed(1)}K`;
    if (number < 1_000_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
    return `${(number / 1_000_000_000).toFixed(1)}B`;
  }

  function getInitial(name) {
    return name?.charAt(0).toUpperCase() || "U";
  }


  function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);
  
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
      { label: "sec", seconds: 1 }
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
  
    return "just now";
  }

  export { formatNumber, getInitial, getTimeAgo };