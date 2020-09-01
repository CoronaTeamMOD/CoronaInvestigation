import React from "react";
import {AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteInputChangeReason} from "@material-ui/lab";

interface NamedObject {
    name:string
}

interface AutocompletedFieldProps<T> {
    value: T | null;
    options: T[];
    onChange: (event: React.ChangeEvent<{}>,
               value: T | null,
               reason: AutocompleteChangeReason,
               details?: AutocompleteChangeDetails<T>) => void;
    onInputChange?:  (event: React.ChangeEvent<{}>,
                      value: string,
                      reason: AutocompleteInputChangeReason) => void;
    label: string;
    constOptions?: boolean;
}

type AutocompletedFieldType = <T extends NamedObject>(props: AutocompletedFieldProps<T>) => JSX.Element;
export default AutocompletedFieldType;