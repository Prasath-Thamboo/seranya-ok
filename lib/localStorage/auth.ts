// auth.ts
import Cookies from 'js-cookie';

export const saveToken = (token: string) => {
    console.log("Saving token:", token);
    localStorage.setItem("access_token", token); // Consistently use "access_token"
    Cookies.set("access_token", token); // Store in cookies if needed
};

export const getToken = () => {
    const token = localStorage.getItem("access_token");
    console.log("Retrieved token:", token);
    return token;
};
