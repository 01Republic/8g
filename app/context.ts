import { createContext } from "react-router";

type User = {
    id: number;
    name: string;
    phone: string;
    profileImgUrl: string;
}

export const userContext = createContext<User | null>(null);
