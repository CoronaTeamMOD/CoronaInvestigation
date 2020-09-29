import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import useFormStyles from 'styles/formStyles';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

export const elementarySchoolGrades = [
    'א',
    'ב',
    'ג',
    'ד',
    'ה',
    'ו',
]

export const highSchoolGrades = [
    'ז',
    'ח',
    'ט',
    'י',
    'יא',
    'יב',
]

const { elementarySchool, highSchool } = placeTypesCodesHierarchy.school.subTypesCodes;

const SchoolEventForm : React.FC<Props> = ({ placeSubType }: Props) : JSX.Element => {
    const { control, errors, setError, clearErrors, setValue} = useFormContext();    

    const formClasses = useFormStyles();
    
    const [grades, setGrades] = useState<string[]>([]);
    
    React.useEffect(() => {
        let gradesOptions : string[] = [];
        if (placeSubType === elementarySchool) gradesOptions = elementarySchoolGrades;
        else if (placeSubType === highSchool) gradesOptions = highSchoolGrades;
        if (placeSubType > 0) setValue(InteractionEventDialogFields.GRADE, gradesOptions[0]);
        setGrades(gradesOptions);
    }, [placeSubType])

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם המוסד'>
                        <Controller 
                            name={InteractionEventDialogFields.PLACE_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                {
                    grades.length > 0 &&
                    <Grid item xs={6}>
                        <FormInput fieldName='כיתה'>
                        <FormControl fullWidth>
                            <InputLabel>כיתה</InputLabel>
                            <Controller 
                                name={InteractionEventDialogFields.GRADE}
                                control={control}
                                render={(props) => (
                                    <Select
                                        test-id='classGrade'
                                        value={props.value}
                                        onChange={(event: React.ChangeEvent<any>) => props.onChange(event.target.value as string)}
                                        label='כיתה'
                                    >
                                        {
                                            grades.map((currentGrade) => (
                                                <MenuItem key={currentGrade} value={currentGrade}>
                                                    {currentGrade}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                )}
                            /> 
                        </FormControl>
                        </FormInput>
                    </Grid>
                }
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

interface Props {
    placeSubType: number;
}

export default SchoolEventForm;