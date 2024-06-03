import { useEffect, useState } from 'react';

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      return setIsAuthenticated(!!localStorage.getItem('token'));
    };

    checkAuthentication();

    window.addEventListener('storage', checkAuthentication);

    return () => window.removeEventListener('storage', checkAuthentication);
  }, []);

  return isAuthenticated;
};

export default useAuthentication;
