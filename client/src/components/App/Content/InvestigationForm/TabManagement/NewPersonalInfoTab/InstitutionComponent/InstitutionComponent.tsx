import React, { useMemo } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

const InstitutionComponent: React.FC<Props> = ({ fieldName, placeholder, options }) => {

    const methods = useFormContext<PersonalInfoTabState>();

    const selectedInstitutionId = methods.watch(fieldName);

    const selectedInstitution = options.find(option => option.id === selectedInstitutionId);

    return (
        <Controller
            name={fieldName}
            control={methods.control}
            render={(props) => (
                <Autocomplete
                    options={options}
                    defaultValue={props.value}
                    getOptionLabel={(option) => {
                        if (options.length > 0) {
                            return option ? (option.subOccupation + (option.street ? ('/' + option.street) : '')): option
                        }
                        return '';
                    }}
                    getOptionSelected={(option) => {
                        return option.id === props.value;
                    }}
                    value={props.value ? {id: props.value, ...selectedInstitution}: {id: -1, subOccupation: ''}}
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