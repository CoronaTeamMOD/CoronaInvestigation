import React from 'react'

import { ContactBankContextProvider, ContactBankOption } from 'commons/Contexts/ContactBankContext';

const MockBankFormProvider: React.FC<Props> = (props) => {
    const { contactBank } = props;

    const mockedState = {
        contactBank: contactBank || new Map(),
        setContactBank: () => {},
        existingEventPersonInfos: []
    };

    return (
        <ContactBankContextProvider value={mockedState}>
            {props.children}
        </ContactBankContextProvider>
    )
}

interface Props {
    contactBank: Map<number,ContactBankOption>;
    existingEventPersonInfos?: (number | undefined)[];
}

export default MockBankFormProvider
