import React from 'react';
import {TextField, StandardTextFieldProps} from '@material-ui/core';

import CircleTextField from 'commons/CircleTextField/CircleTextField';
import Validator from 'Utils/Validations/Validator';

const PHONE_LABEL = 'טלפון:';

const PhoneNumberTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const [isError, setIsError] = React.useState<boolean>(false);

    const {id, value, onChange, testId, ...rest } = props;

    return (
        <CircleTextField
            {...rest}
            error={isError}
            onBlur={() => setIsError(value && !Validator.phoneValidation(value as string))}
            onFocus={() => setIsError(false)}
            label={isError && 'שגיאה: מספר שהוזן אינו תקין'}
            test-id={testId}
            id={id}
            placeholder={PHONE_LABEL}
            size='small'
            value={value}
            onChange={onChange}
        />
    );
};

export default PhoneNumberTextField;

interface Props extends StandardTextFieldProps {
    onChange: (event: any) => void;
    testId?: string;
};