import React from 'react';
import {TextField, StandardTextFieldProps} from '@material-ui/core';

import Validator from 'Utils/Validations/Validator';
import CircleTextField, { Props as circleTextFieldProps } from 'commons/CircleTextField/CircleTextField';

const NOT_PHONE_ERROR = 'שגיאה: מספר שהוזן אינו תקין';

const PhoneNumberTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const [isError, setIsError] = React.useState<boolean>(false);

    const {id, value, onChange, testId, ...rest } = props;

    return (
        <CircleTextField
            {...rest}
            error={isError}
            onBlur={() => setIsError(value && !Validator.phoneValidation(value as string))}
            onFocus={() => setIsError(false)}
            label={isError && NOT_PHONE_ERROR}
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
};