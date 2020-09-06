import React from 'react';
import {TextField} from '@material-ui/core';
import {Autocomplete, AutocompleteRenderInputParams} from '@material-ui/lab';
import AutocompletedFieldType from './AutoCompletedFieldTypes';
import useStyles from './AutoCompletedFieldStyles';
import useFormStyles from 'styles/formStyles';

const AutocompletedField: AutocompletedFieldType = (props) => {
    const {value, options, onChange, onInputChange, label, constOptions = false} = props;
    const formClasses = useFormStyles();
    const classes = useStyles();
    const noOptionsMessage = 'וודאו כי הקלדתם שם תקין';

    const inputElement = (params: AutocompleteRenderInputParams) =>
        <TextField {...params}
                   inputProps={{style: {padding: 0}, ...params.inputProps}}
                   InputLabelProps={{classes: {root: formClasses.roundedTextLabel}}}
                   InputProps={{
                       classes: {root: formClasses.roundedTextField},
                       ...params.InputProps
                   }}
                   label={label} variant='outlined' fullWidth />;

    const filterOptions = (x: any) => x;

    const staticOptionConfig = {
        autoComplete: true,
        filterSelectedOptions: true,
        includeInputInList: true,
        clearOnBlur: false,
        filterOptions
    };

    const config = (!constOptions) ? {...staticOptionConfig} : {};

    return (
        <Autocomplete
            className={classes.autcompleteField}
            {...config}
            value={value}
            options={options} noOptionsText={noOptionsMessage}
            getOptionLabel={(option) => (option.name)}
            onChange={onChange}
            renderInput={inputElement}
            onInputChange={onInputChange}
        />
    );
};

export default AutocompletedField;