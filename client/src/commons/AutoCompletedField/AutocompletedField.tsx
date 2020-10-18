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
        className, filterOptions = (x: any) => x,
        noOptionsMessage = defaultNoOptionsMessage
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
            options={options} noOptionsText={noOptionsMessage}
            filterOptions={filterOptions}
            getOptionLabel={props.getOptionLabel || genericLabel}
            onChange={onChange}
            renderInput={inputElement}
            onInputChange={onInputChange}
        />
    );
};

export default AutocompletedField;
