import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import useStyles from './AutoCompletedFieldStyles';
import AutocompletedFieldType from './AutoCompletedFieldTypes';
const defaultNoOptionsMessage = 'הקלידו מיקום תיקני לחיפוש...';

const AutocompletedField: AutocompletedFieldType = (props) => {
    const {
        required,
        value,
        options,
        onChange,
        onInputChange,
        constOptions = false,
        label,
        placeholder,
        filterOptions = (x: any) => x,
        noOptionsMessage = defaultNoOptionsMessage,
        fullWidth
    } = props;
    const classes = useStyles();


    const inputElement = (params: AutocompleteRenderInputParams) =>
        <TextField className={classes.autcompleteField}
                   required={required} placeholder={placeholder} label={label} {...params} fullWidth/>;

    const staticOptionConfig = {
        autoComplete: true,
        filterSelectedOptions: true,
        includeInputInList: true,
        clearOnBlur: false,
        filterOptions
    };

    const config = (!constOptions) ? { ...staticOptionConfig } : {};

    const genericLabel = (option: any) => (option.name);
    return (
        <Autocomplete
            {...config}
            {...(props.renderOption) ? { renderOption: props.renderOption } : {}}
            value={value}
            fullWidth={fullWidth}
            options={options} noOptionsText={noOptionsMessage}
            filterOptions={filterOptions}
            getOptionLabel={props.getOptionLabel || genericLabel}
            onChange={onChange}
            renderInput={inputElement}
            onInputChange={(event, value, reason) => {
                if (event?.type !== 'blur' && onInputChange) {
                    onInputChange(event, value, reason);
                }
            }}
        />
    );
};

export default AutocompletedField;
