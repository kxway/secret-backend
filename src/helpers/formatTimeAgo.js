function formatTimeAgo(timestamp) {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const timeDiff = Math.abs(now.getTime() - messageDate.getTime());
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} dia(s) atrás`;
  } else if (hours > 0) {
    return `${hours} hora(s) atrás`;
  } else if (minutes > 0) {
    return `${minutes} minuto(s) atrás`;
  } else {
    return `${seconds} segundo(s) atrás`;
  }
}

module.exports = formatTimeAgo;
