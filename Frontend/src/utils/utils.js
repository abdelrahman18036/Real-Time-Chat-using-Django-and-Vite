export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "a while ago";
  const now = new Date();
  const diff = now - new Date(lastSeen);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes === 1) return "a minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "an hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "a day ago";
  return `${days} days ago`;
};
