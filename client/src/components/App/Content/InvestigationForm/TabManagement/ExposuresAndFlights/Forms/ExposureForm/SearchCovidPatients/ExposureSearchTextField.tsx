import * as yup from 'yup';
import React, { useMemo } from 'react';
import { Search } from '@material-ui/icons';
import { IconButton, InputAdornment } from '@material-ui/core';

import { ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX } from 'commons/Regex/Regex';
import { AlphabetTextFieldProps } from 'commons/AlphabetTextField/AlphabetTextFieldTypes';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { alphaNumericWhiteSpaceErrorMessage, max50LengthErrorMessage } from 'commons/Schema/messages';

const INSERT_EXPOSURE_SOURCE_SEARCH = 'הזן מספר אפידמיולוגי, שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';

interface Props extends AlphabetTextFieldProps<string> {
  value: string | null;
  onSearchClick: () => void; 
  onKeyDown: (e : React.KeyboardEvent) => void;
  fullWidth? : boolean
};

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX, alphaNumericWhiteSpaceErrorMessage)
  .max(50, max50LengthErrorMessage);

const ExposureSearchTextField = (props: Props) => {
    const { value, onSearchClick, ...rest } = props;
    const serachValue : string = useMemo(() => value || '', [value]);
    
    return (
        <TypePreventiveTextField
            {...rest}
            value={serachValue}
            validationSchema={stringAlphabet}
            placeholder={INSERT_EXPOSURE_SOURCE_SEARCH}
            test-id='exposureSource'
        />
    );
};

export default ExposureSearchTextField; 