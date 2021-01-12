import * as yup from 'yup';
import React, { useMemo } from 'react';
import { Search } from '@material-ui/icons';
import { IconButton, InputAdornment } from '@material-ui/core';

import { AlphabetTextFieldProps } from 'commons/AlphabetTextField/AlphabetTextFieldTypes';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

import useStyles from './ExposureSearchTextFieldStyles';

const errorMessage = 'השדה יכול להכיל רק אותיות, מספרים, מקף ורווח';
const maxLengthErrorMessage = 'השדה יכול להכיל 100 תווים בלבד';
const INSERT_EXPOSURE_SOURCE_SEARCH = 'הזן מספר אפידמיולוגי, שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';

interface Props extends AlphabetTextFieldProps<string> {
  value: string | null;
  onSearchClick: () => void; 
  onKeyDown: (e : React.KeyboardEvent) => void;
}

const stringAlphabet = yup
  .string()
  .matches(/^[a-zA-Z\u0590-\u05fe\s0-9-]*$/, errorMessage)
  .max(50, maxLengthErrorMessage);

const ExposureSearchTextField = (props: Props) => {
    const { value, onSearchClick, ...rest } = props;
    const serachValue : string = useMemo(() => value || '', [value]);
    const classes = useStyles();

    return (
        <TypePreventiveTextField
            {...rest}
            value={serachValue}
            validationSchema={stringAlphabet}
            InputProps={{
            endAdornment: (
                <InputAdornment position='end'>
                    <IconButton onClick={onSearchClick}>
                        <Search className={classes.serachIcon} />
                    </IconButton>
                </InputAdornment>
            )
            }}
            placeholder={INSERT_EXPOSURE_SOURCE_SEARCH}
            test-id='exposureSource'
        />
    );
};

export default ExposureSearchTextField; 