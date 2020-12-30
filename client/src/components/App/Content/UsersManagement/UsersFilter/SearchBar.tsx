import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Close, Search } from '@material-ui/icons';

import { stringAlphanum } from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './SearchBarStyles';

const searchBarLabel = 'הכנס שם או שם משתמש...';
const searchBarError = 'יש להכניס רק אותיות ומספרים';

const SearchBar: React.FC<Props> = (props: Props) => {

    const { onClick } = props;

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isQueryValid, setIsQueryValid] = useState<boolean>(true);

    const classes = useStyles();

    const handleChange = (value: string) => {
        if (stringAlphanum.isValidSync(value)) {
            setSearchQuery(value);
            !isQueryValid && setIsQueryValid(true);
        } else {
            setIsQueryValid(false);
        }
    }

    const onClearClick = () => {
        setSearchQuery('');
        !isQueryValid && setIsQueryValid(true);
        onClick(''); 
    }

    return (
        <TextField
            value={searchQuery}
            className={classes.searchBar}
            onChange={event => handleChange(event.target.value as string)}
            onKeyPress={event => {
                event.key === 'Enter' &&
                onClick(searchQuery);
            }}
            label={isQueryValid ? searchBarLabel : searchBarError}
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        {
                            searchQuery.length > 0 &&
                            <IconButton
                                onClick={onClearClick}
                                className={classes.searchBarIcons} 
                            >
                                <Close />
                            </IconButton>
                        }
                            <IconButton
                                onClick={() => onClick(searchQuery)}
                                className={classes.searchBarIcons} 
                            >
                                <Search />
                            </IconButton>
                    </InputAdornment>
                ),
            }}
            error={!isQueryValid}
        />
    );
}

interface Props {
    onClick: (value: string) => void;
}

export default SearchBar;
