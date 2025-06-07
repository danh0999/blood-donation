const redirectByRole = (role, navigate) => {
  const roleRoutes = {
    ADMIN: "/admin",
    STAFF: "/staff",
    HOSPITAL_STAFF: "/hospital",
    USER: "/",
  };
  navigate(roleRoutes[role] || "/");
};
export default redirectByRole;
