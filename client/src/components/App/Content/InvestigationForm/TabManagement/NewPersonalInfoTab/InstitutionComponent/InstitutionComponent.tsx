import React, { useMemo } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

const InstitutionComponent: React.FC<Props> = ({ fieldName, placeholder, options }) => {

    const methods = useFormContext<PersonalInfoTabState>();

    const selectedInstitution = methods.watch(fieldName);

    const inputValue = options.find(option => option.id === selectedInstitution)?.subOccupation;

    // const inputValue = useMemo<string | undefined>(() => {
    //     return options.find(option => option.id === selectedInstitution)?.subOccupation;
    // }, [selectedInstitution])

    return (
        <Controller
            name={fieldName}
            control={methods.control}
            render={(props) => (
                <Autocomplete
                    options={options}
                    defaultValue={props.value}
                    getOptionLabel={(option) => {
                        console.log('option: ',option, '\noptions: ', options)
                        return option.subOccupation ? (option.subOccupation + (option.street ? ('/' + option.street) : '')) : inputValue as string;
                    }}
                    getOptionSelected={(option, value) => {
                        return option.id === value;
                    }}
                    value={props.value || ''}
                    onChange={(event, newValue) => {
                        props.onChange(newValue ? newValue.id : '')
                    }}
                    inputValue={inputValue}
                    loading={options.length === 0}
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