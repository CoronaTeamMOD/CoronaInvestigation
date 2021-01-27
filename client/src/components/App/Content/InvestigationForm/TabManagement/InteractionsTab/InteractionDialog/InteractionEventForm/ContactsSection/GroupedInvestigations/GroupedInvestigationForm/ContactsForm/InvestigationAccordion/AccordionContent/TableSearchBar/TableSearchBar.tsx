import * as yup from 'yup';
import React, { useMemo, useState } from 'react';
import { Search } from '@material-ui/icons';
import { IconButton, InputAdornment } from '@material-ui/core';

import { ALPHANUMERIC_SLASHES_TEXT_REGEX } from 'commons/Regex/Regex';
import { AlphabetTextFieldProps } from 'commons/AlphabetTextField/AlphabetTextFieldTypes';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

import useStyles from './tableSearchBarStyles';

const errorMessage = 'השדה יכול להכיל רק אותיות, מספרים, מקף ורווח';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תווים בלבד';
const INSERT_TABLE_SEARCH = 'הזן שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';

interface Props {
  onSearchClick: (searchQuery : string) => void; 
}

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_SLASHES_TEXT_REGEX, errorMessage)
  .max(50, maxLengthErrorMessage);

const TableSearchBar = (props: Props) => {
    const [searchQuery, setsearchQueries] = useState<string>("");

    const { onSearchClick , ...rest} = props;
    const classes = useStyles();

    return (
        <TypePreventiveTextField
            {...rest}
            name='tableSearchBar'
            className={classes.searchBar}
            value={searchQuery}
            validationSchema={stringAlphabet}
            InputProps={{
            endAdornment: (
                <InputAdornment position='end'>
                    <IconButton onClick={() => onSearchClick(searchQuery)}>
                        <Search className={classes.serachIcon} />
                    </IconButton>
                </InputAdornment>
            )
            }}
            placeholder={INSERT_TABLE_SEARCH}
            test-id='exposureSource'
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearchClick(searchQuery);
                }
            }}
            onChange={(value) => { 
                setsearchQueries(value);
            }}
        />
    );
};

export default TableSearchBar; 