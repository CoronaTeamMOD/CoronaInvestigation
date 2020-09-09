import React from 'react';
import {Autocomplete, AutocompleteRenderInputParams} from '@material-ui/lab';

import AutocompletedFieldType from './AutoCompletedFieldTypes';
import useStyles from './AutoCompletedFieldStyles';
import CircleTextField from '../CircleTextField/CircleTextField';

const AutocompletedField: AutocompletedFieldType = (props) => {
    const {value, options, onChange, onInputChange, constOptions = false} = props;
    const classes = useStyles();
    const noOptionsMessage = 'הקלידו מיקום תיקני לחיפוש...';

    const inputElement = (params: AutocompleteRenderInputParams) =>
        <CircleTextField {...params} fullWidth />;

    const filterOptions = (x: any) => x;

    const staticOptionConfig = {
        autoComplete: true,
        filterSelectedOptions: true,
        includeInputInList: true,
        clearOnBlur: false,
        filterOptions
    };

    const config = (!constOptions) ? {...staticOptionConfig} : {};

    const genericLabel = (option:any) => (option.name);
    return (
        <Autocomplete
            className={classes.autcompleteField}
            {...config}
            {...(props.renderOption) ? {renderOption: props.renderOption} : {}}
            value={value}
            options={options} noOptionsText={noOptionsMessage}
            getOptionLabel={props.getOptionLabel || genericLabel}
            onChange={onChange}
            renderInput={inputElement}
            onInputChange={onInputChange}
        />
    );
};

export default AutocompletedField;
