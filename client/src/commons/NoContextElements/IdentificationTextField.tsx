import React from 'react';
import * as yup from 'yup';

import { NUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import { max15LengthNumErrorMessage, numericErrorMessage } from 'commons/Schema/messages';

import TypePreventiveTextField from './TypingPreventionTextField';

const IdentificationTextField = (props : Props) => {

    const schema = yup.string().matches(NUMERIC_TEXT_REGEX, numericErrorMessage).max(15, max15LengthNumErrorMessage);

    return (
        <TypePreventiveTextField
            {...props}
            value={props.value || ''}
            validationSchema={schema}
        />
    );
};

interface Props{
    disabled?: boolean,
    testId?: string,
    name: string,
    value: string | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
    error: string
};

export default IdentificationTextField;