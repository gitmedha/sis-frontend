export const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole.toLowerCase() === 'admin';
}
