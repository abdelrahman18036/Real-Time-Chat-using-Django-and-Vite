// utils/utils.js
export const formatLastSeen = (isoString) => {
  const timeDiff = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000
  );
  const seconds = timeDiff % 60;
  const minutes = Math.floor(timeDiff / 60) % 60;
  const hours = Math.floor(timeDiff / 3600) % 24;
  const days = Math.floor(timeDiff / 86400);

  if (timeDiff < 60) {
    return "just now";
  }
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ago`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }
  return `${seconds}s ago`;
};
