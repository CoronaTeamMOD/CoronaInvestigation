import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

const InstitutionComponent: React.FC<Props> = ({ fieldName, placeholder, options }) => {

    const methods = useFormContext<PersonalInfoTabState>();

    return (
        <Controller
            name={fieldName}
            control={methods.control}
            render={(props) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.subOccupation + (option.street ? ('/' + option.street) : '')}
                    value={props.value?.id || ''}
                    onChange={(event, newValue) => {
                        props.onChange(newValue ? newValue.id : '')
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            error={methods.errors[fieldName] && options.length !== 0}
                            label={(methods.errors[fieldName]?.message && options.length !== 0)
                                ?
                                methods.errors[fieldName]?.message
                                :
                                'שם מוסד*'
                            }
                            onBlur={props.onBlur}
                            test-id='insertInstitutionName'
                            disabled={options.length === 0}
                            id={fieldName}
                            placeholder={placeholder}
                        />}
                />
            )}
        />
    );
};

interface Props {
    placeholder: string;
    options: SubOccupationAndStreet[];
    fieldName: keyof PersonalInfoTabState;
}

export default InstitutionComponent;