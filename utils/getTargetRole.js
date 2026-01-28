export const getTargetRole = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return "";
  const user = JSON.parse(userStr);
  return user.targetRole || "";
};
