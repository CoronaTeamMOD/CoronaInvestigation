import React from 'react';
import { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteInputChangeReason,
        AutocompleteRenderOptionState, FilterOptionsState } from '@material-ui/lab';

export interface AutocompletedFieldProps<T> {
    required?: boolean;
    value: T | null;
    options: T[];
    onChange: (event: React.ChangeEvent<{}>,
        value: T | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<T>) => void;
    onInputChange?: (event: React.ChangeEvent<{}>,
        value: string,
        reason: AutocompleteInputChangeReason) => void;
    constOptions?: boolean;
    getOptionLabel?: (option: T) => string;
    renderOption?: (option: T, state: AutocompleteRenderOptionState) => React.ReactNode;
    filterOptions?: (options: T[], state: FilterOptionsState<any>) => T[];
    className?: string;
    label?: string;
    placeholder?: string;
    noOptionsMessage?: string;
    fullWidth?: boolean;
    error?: boolean;
    isViewMode?:boolean;
}

type AutocompletedFieldType = <T>(props: AutocompletedFieldProps<T>) => JSX.Element;
export default AutocompletedFieldType;
