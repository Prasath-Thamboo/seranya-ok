// auth.ts
import Cookies from 'js-cookie';

export const saveToken = (token: string) => {
    console.log("Saving token:", token);
    localStorage.setItem("token", token); // Enregistrer en tant que chaîne
    Cookies.set("token", token); // Sauvegarder aussi dans les cookies si nécessaire
};

export const getToken = () => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    return token;
};
