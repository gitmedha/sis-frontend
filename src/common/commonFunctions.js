export const isSRM = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole.toLowerCase() === 'basic';
}

export const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole.toLowerCase() === 'admin';
}

export const isChapterHead = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole.toLowerCase() === 'chapter head';
}
