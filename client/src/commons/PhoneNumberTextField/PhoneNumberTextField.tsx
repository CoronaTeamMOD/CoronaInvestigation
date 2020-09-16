import React from 'react';

import Validator from 'Utils/Validations/Validator';
import { Props as circleTextFieldProps } from 'commons/CircleTextField/CircleTextField';
import { TextField } from '@material-ui/core';

const NOT_PHONE_ERROR = 'שגיאה: מספר שהוזן אינו תקין';
const REQUIRED_TITLE = 'שדה חובה';


const PhoneNumberTextField: React.FC<Props> = (props: Props): JSX.Element => {

    const {id, value, onChange, testId, isValid, setIsValid, required, ...rest } = props;

    return (
        <TextField
            {...rest}
            required={required}
            error={!isValid}
            onBlur={() => setIsValid(!value || Validator.phoneValidation(value as string))}
            onFocus={() => setIsValid(true)}
            label={!isValid ? NOT_PHONE_ERROR : required && REQUIRED_TITLE}
            test-id={testId}
            id={id}
            size='small'
            value={value}
            onChange={onChange}
        />
    );
};

export default PhoneNumberTextField;

interface Props extends circleTextFieldProps {
    onChange: (event: any) => void;
    testId?: string;
    isValid: boolean;
    required?: boolean;
    setIsValid: (isValid: boolean) => void;
};