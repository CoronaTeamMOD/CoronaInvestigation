import React from 'react';
import * as yup from 'yup';

import { NUMERIC_TEXT_REGEX } from 'commons/Regex/Regex';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { max15LengthNumErrorMessage, max9LengthIdErrorMessage, numericErrorMessage } from 'commons/Schema/messages';

const IdentificationTextField = (props : Props) => {

    const schema = props.isId 
        ? yup.string().matches(NUMERIC_TEXT_REGEX, numericErrorMessage).max(9, max9LengthIdErrorMessage)
        : yup.string().matches(NUMERIC_TEXT_REGEX, numericErrorMessage).max(15, max15LengthNumErrorMessage);
    
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
    isId?: boolean,
};

export default IdentificationTextField;