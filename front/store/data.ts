import { create } from "zustand";

export type User = {
    name: string;
    weight: string;
    age: string;
    height: string;
    level: string;
    objective: string;
    gender: string;
    hipertensive: boolean;
    diabetic: boolean;
    allergies?: string | boolean;
}

type DataState = {
    user: User;
    setPageOne: (data: Omit<User, "gender" | "objective" | "level">) => void;
    setPageTwo: (data: Pick<User, "gender" | "objective" | "level" | "hipertensive" | "diabetic" | "allergies">) => void;
    setUser: (data: Partial<User>) => void;
}

export const useDataStore = create<DataState>(set => ({
    user: {
        name: '',
        weight: '',
        age: '',
        height: '',
        level: '',
        objective: '',
        gender: '',
        hipertensive: false,
        diabetic: false,
        allergies: ''
    },
    setPageOne: data => set(state => ({ user: { ...state.user, ...data } })),
    setPageTwo: data => set(state => ({ user: { ...state.user, ...data } })),
    setUser: data => set(state => ({ user: { ...state.user, ...data } }))
}))