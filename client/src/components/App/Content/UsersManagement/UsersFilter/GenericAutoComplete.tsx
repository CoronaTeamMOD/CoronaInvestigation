import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import County from 'models/County';
import Language from 'models/Language';
import UserTypeModel from 'models/UserType';
import activeStatus from 'models/ActiveStatus';
import SourceOrganization from 'models/SourceOrganization';

const GenericAutoComplete: React.FC<GenericAutoCompleteProps> = (props: GenericAutoCompleteProps) => {
    const { options, handleChange, inputRootClass } = props;

    return (
        <Autocomplete
            disableCloseOnSelect
            multiple
            options={options}
            getOptionLabel={(option: any) => option ? option.displayName : option}
            onChange={(event, selectedValues) => handleChange(selectedValues)}
            classes={{ inputRoot: inputRootClass }}
            renderInput={(params) =>
                <TextField
                    {...params}
                />
            }
            renderTags={(tags: any) => {
                const additionalTagsAmount = tags.length - 1;
                const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                return tags[0].displayName + additionalDisplay;
            }}
        />
    )
};

export default GenericAutoComplete;

interface GenericAutoCompleteProps {
    options: SourceOrganization[] | Language[] | County[] | UserTypeModel[] | activeStatus[];
    handleChange: (selectedValues: any) => void;
    inputRootClass?: string;
};
