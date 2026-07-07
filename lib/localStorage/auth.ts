// auth.ts
import Cookies from 'js-cookie';

export const saveToken = (token: string) => {
    localStorage.setItem("access_token", token); // Consistently use "access_token"
    Cookies.set("access_token", token); // Store in cookies if needed
};

export const getToken = () => {
    return localStorage.getItem("access_token");
};
