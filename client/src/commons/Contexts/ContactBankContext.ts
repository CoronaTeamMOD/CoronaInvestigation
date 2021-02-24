import { createContext } from 'react';

export interface ContactBankOption {
    contactType: number,
    extraInfo?: string,
    checked: boolean
}

export interface ContactBankContext {
    contactBank: Map<number,ContactBankOption>;
    setContactBank: React.Dispatch<React.SetStateAction<Map<number,ContactBankOption>>>;
    existingEventPersonInfos?: (number | undefined)[];
};

export const initialContactBank: ContactBankContext = {
    contactBank: new Map(),
    setContactBank: () => {},
    existingEventPersonInfos: []
};

export const contactBankContext = createContext<ContactBankContext>(initialContactBank);
export const ContactBankContextProvider = contactBankContext.Provider;