import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

const INSTITUTION_NAME = 'שם מוסד*';

const InstitutionComponent: React.FC<Props> = ({ fieldName, placeholder, options, isViewMode }) => {

    const { control, errors, watch } = useFormContext<PersonalInfoTabState>();

    const selectedInstitutionId = watch(fieldName);

    const selectedInstitution = options.find(option => option.id === selectedInstitutionId);

    return (
        <Controller
            name={fieldName}
            control={control}
            render={(props) => (
                <Autocomplete
                    options={options}
                    disabled={isViewMode}
                    defaultValue={props.value}
                    getOptionLabel={(option) => {
                        if (options.length > 0) {
                            return option ? (option.subOccupation + (option.street ? ('/' + option.street) : '')) : option
                        }
                        return '';
                    }}
                    getOptionSelected={(option) => {
                        return option.id === props.value;
                    }}
                    value={props.value ? { id: props.value, ...selectedInstitution } : { id: -1, subOccupation: '' }}
                    onChange={(event, newValue) => {
                        props.onChange(newValue ? newValue.id : '')
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            error={errors[fieldName] && options.length !== 0}
                            label={((errors[fieldName] as FieldError)?.message && options.length !== 0)
                                ?
                                (errors[fieldName] as FieldError)?.message
                                :
                                INSTITUTION_NAME
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
    isViewMode: boolean;
}

export default InstitutionComponent;