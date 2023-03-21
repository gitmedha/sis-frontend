export const isSRM = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'basic';
}

export const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'admin';
}

export const isChapterHead = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'chapter head';
}
