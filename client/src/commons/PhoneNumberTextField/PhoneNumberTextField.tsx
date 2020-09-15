import React from 'react';
import {TextField, StandardTextFieldProps} from '@material-ui/core';

import Validator from 'Utils/Validations/Validator';
import CircleTextField, { Props as circleTextFieldProps } from 'commons/CircleTextField/CircleTextField';

const NOT_PHONE_ERROR = 'שגיאה: מספר שהוזן אינו תקין';

const PhoneNumberTextField: React.FC<Props> = (props: Props): JSX.Element => {

    const {id, value, onChange, testId, isValid, setIsValid, ...rest } = props;

    return (
        <CircleTextField
            {...rest}
            error={!isValid}
            onBlur={() => setIsValid(!value || Validator.phoneValidation(value as string))}
            onFocus={() => setIsValid(true)}
            label={!isValid && NOT_PHONE_ERROR}
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
    setIsValid: (isValid: boolean) => void;
};