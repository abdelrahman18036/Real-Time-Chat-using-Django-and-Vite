// utils.js
export const formatLastSeen = (lastSeen) => {
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diff = Math.abs(now - lastSeenDate);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} minute(s) ago`;
  } else if (hours < 24) {
    return `${hours} hour(s) ago`;
  } else {
    return `${days} day(s) ago`;
  }
};
