import React from 'react'

import { ContactBankContextProvider, ContactBankOption } from 'commons/Contexts/ContactBankContext';

const MockBankFormProvider: React.FC<Props> = (props) => {
    const { contactBank, setContactBank, existingEventPersonInfos } = props;

    const mockedState = {
        contactBank: contactBank || new Map(),
        setContactBank: setContactBank || (() => {}),
        existingEventPersonInfos: existingEventPersonInfos || []
    };

    return (
        <ContactBankContextProvider value={mockedState}>
            {props.children}
        </ContactBankContextProvider>
    )
}

interface Props {
    contactBank?: Map<number,ContactBankOption>;
    setContactBank?: React.Dispatch<React.SetStateAction<Map<number,ContactBankOption>>>; 
    existingEventPersonInfos?: (number | undefined)[];
}

export default MockBankFormProvider
