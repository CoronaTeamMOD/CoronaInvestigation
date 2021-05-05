import * as yup from 'yup';
import React, { useMemo } from 'react';

import { ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX } from 'commons/Regex/Regex';
import { AlphabetTextFieldProps } from 'commons/AlphabetTextField/AlphabetTextFieldTypes';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { alphaNumericWhiteSpaceErrorMessage, max50LengthErrorMessage } from 'commons/Schema/messages';

interface Props extends AlphabetTextFieldProps<string> {
  value: string | null;
  fullWidth? : boolean;
};

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX, alphaNumericWhiteSpaceErrorMessage)
  .max(50, max50LengthErrorMessage);

const ExposureSearchTextField = (props: Props) => {
    const { value, ...rest } = props;
    const serachValue : string = useMemo(() => value || '', [value]);
    
    return (
        <TypePreventiveTextField
            {...rest}
            value={serachValue}
            validationSchema={stringAlphabet}
            test-id='exposureSource'
        />
    );
};

export default ExposureSearchTextField; 