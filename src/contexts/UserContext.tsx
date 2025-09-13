import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export const getUserContext = () => {
    return useContext(UserContext);
}