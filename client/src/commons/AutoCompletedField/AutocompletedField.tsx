import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import useStyles from './AutoCompletedFieldStyles';
import AutocompletedFieldType from './AutoCompletedFieldTypes';

const AutocompletedField: AutocompletedFieldType = (props) => {
    const { required, value, options, onChange, onInputChange, constOptions = false, className, filterOptions = (x:any) => x} = props;
    const classes = useStyles();
    const noOptionsMessage = 'הקלידו מיקום תיקני לחיפוש...';

    const inputElement = (params: AutocompleteRenderInputParams) =>
        <TextField required={required} {...params} fullWidth />;

    const staticOptionConfig = {
        autoComplete: true,
        filterSelectedOptions: true,
        includeInputInList: true,
        clearOnBlur: false,
        disableClearable: true,
        filterOptions
    };

    const config = (!constOptions) ? { ...staticOptionConfig } : {};

    const genericLabel = (option: any) => (option.name);
    return (
        <Autocomplete
            className={classes.autcompleteField + className}
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