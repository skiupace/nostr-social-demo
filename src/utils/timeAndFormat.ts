export const formatTime = (ts: number) => {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} يوم`;
  return `${Math.floor(diff / 604800)} أسبوع`;
};

export const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};
