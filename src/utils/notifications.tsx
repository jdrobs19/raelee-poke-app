import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = {
  error: (message: string) => toast.error(message, { position: "top-right" }),
  success: (message: string) => toast.success(message, { position: "top-right" }),
};

export const logoutErrorNotification = (error: Error) => notify.error(`Logout failed: ${error.message}`);
export const logoutSuccessNotification = () => notify.success("Logout successful!");
export const loginErrorNotification = (error: Error) => notify.error(`Login failed: ${error.message}`);
export const pokemonAddNotification = (name: string) => notify.success(`${name} added to your collection!`);
export const pokemonRemoveNotification = (name: string) => notify.success(`${name} removed from your collection`);
export const registerErrorNotification = (error: Error) => notify.error(`Registration failed: ${error.message}`);
export const registerSuccessNotification = () => notify.success("Registration successful!");
export const compareQueueNotification = (name: string, action: string) => notify.success(`${name} ${action === "add" ? "added to" : "removed from"} compare`);
export const addPokemonFailureNotification = () => notify.error("Please login to add pokemon");
export const pokemonAlreadyExistsNotification = (name: string) => notify.error(`${name} is already in your collection`);
export const tcgCardAddNotification = (name: string) => notify.success(`${name} added to your collection!`);
export const tcgCardRemoveNotification = (name: string) => notify.success(`${name} removed from your collection`);
export const addTcgCardFailureNotification = () => notify.error("Please login to add trading cards");
export const tcgCardAlreadyExistsNotification = (name: string) => notify.error(`${name} is already in your collection`);