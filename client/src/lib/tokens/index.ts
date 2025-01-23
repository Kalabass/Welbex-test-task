export const getTokenFromLocalStorage = () => {
  const data = localStorage.getItem('access_token');
  const accessToken = data ? JSON.parse(data) : '';

  return accessToken;
};

export const setTokenToLocalStorage = (accessToken: string) => {
  if (localStorage.getItem('access_token')) {
    localStorage.removeItem('access_token');
  }

  localStorage.setItem('access_token', JSON.stringify(accessToken));
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem('access_token');
};
