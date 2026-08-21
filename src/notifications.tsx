import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const logoutErrorNotification = (error: Error) => {
    toast.error(`Logout failed: ${error.message}`, {
        position: "top-right"
    });
}

export const logoutSuccessNotification = () => {
    toast.success("Logout successful!", {
        position: "top-right"
    });
}

export const loginErrorNotification = (error: Error) => {
    toast.error(`Login failed: ${error.message}`, {
        position: "top-right"
    });
}

export const pokemonAddNotification = (pokemonName: string) => {
    toast.success(`${pokemonName} added to your collection!`, {
        position: "top-right"
    });
}

export const pokemonRemoveNotification = (pokemonName: string) => {
    toast.success(`${pokemonName} removed from your collection!`, {
        position: "top-right"
    });
}

export const registerErrorNotification = (error: Error) => {
    toast.error(`Registration failed: ${error.message}`, {
        position: "top-right"
    });
}

export const registerSuccessNotification = () => {
    toast.success("Registration successful!", {
        position: "top-right"
    });
}