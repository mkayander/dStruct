import React, { createContext } from 'react';

type MutableItem<T> = {
    current: T;
    setValue: React.Dispatch<React.SetStateAction<T>>;
};

export type GlobalContextType = {};

export const GlobalContext = createContext<GlobalContextType>({});
