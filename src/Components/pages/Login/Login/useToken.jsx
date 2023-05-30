
import { useState } from 'react';


export default function useToken() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [isSuper, setIsSuper] = useState(sessionStorage.getItem('is_super'));

  const saveToken = (userToken, userIsSuper) => {
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('is_super', userIsSuper);
    setToken(userToken);
    setIsSuper(userIsSuper);
  };

  return {
    token: token || '',
    isSuper: isSuper || '',
    setToken: saveToken,
  };
}