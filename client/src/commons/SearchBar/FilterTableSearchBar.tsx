import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Close, Search } from '@material-ui/icons';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';

import useStyles from './SearchBarStyles';

const FilterTableSearchBar: React.FC<Props> = (props: Props) => {

    const { searchBarLabel, onClick, validationSchema, id, searchQuery, setSearchQuery, changeSearchFilter } = props;

    const [queryValidationError, setQueryValidationError] = useState<string>('');
    const classes = useStyles();

    const handleChange = (value: string) => {
        try {

            validationSchema.validateSync(value);
            setSearchQuery(value);
            setQueryValidationError('');
        } catch (error) {
            setQueryValidationError(error.errors[0]);
        }
    }

    const onClearClick = () => {
        setSearchQuery('');
        setQueryValidationError('');
    }


    return (
        <TextField
            id={id}
            value={searchQuery}
            className={classes.searchBar}
            onChange={event => handleChange(event.target.value as string)}
            onKeyPress={event => {
                event.key === 'Enter' &&
                    onClick(searchQuery);
            }}
            onBlur={() => { changeSearchFilter(searchQuery) }}
            label={queryValidationError || searchBarLabel}
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
            error={Boolean(queryValidationError)}
        />
    );
};

interface Props {
    id?: string;
    searchBarLabel: string;
    onClick: (value: string) => void;
    onChange?: (value: string) => void;
    validationSchema: yup.StringSchema<string | undefined, object>;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    changeSearchFilter: (searchQuery: string) => void;
};

export default FilterTableSearchBar;