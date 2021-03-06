import * as yup from 'yup';
import React, { useState } from 'react';
import { Search } from '@material-ui/icons';
import { IconButton, InputAdornment } from '@material-ui/core';

import { ALPHANUMERIC_SLASHES_TEXT_REGEX } from 'commons/Regex/Regex';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { alphaNumericWhiteSpaceErrorMessage, max50LengthErrorMessage } from 'commons/Schema/messages';

import useStyles from './contactsBankSearchBarStyles';

const INSERT_TABLE_SEARCH = 'הזן שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';

interface Props {
  id: string;
  onSearchClick: (searchQuery : string) => void; 
}

const stringAlphabet = yup
  .string()
  .matches(ALPHANUMERIC_SLASHES_TEXT_REGEX, alphaNumericWhiteSpaceErrorMessage)
  .max(50, max50LengthErrorMessage);

const TableSearchBar = (props: Props) => {
    const [searchQuery, setsearchQueries] = useState<string>('');

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
                    <IconButton id='searchIconButton' onClick={() => onSearchClick(searchQuery)}>
                        <Search color='primary' />
                    </IconButton>
                </InputAdornment>
            )
            }}
            placeholder={INSERT_TABLE_SEARCH}
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