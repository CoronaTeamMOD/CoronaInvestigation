import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

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

const numbersRegex = /(\d+)/;
const hebrewLettersRegex = /([א-ת]+)/;

const { elementarySchool, highSchool } = placeTypesCodesHierarchy.school.subTypesCodes;

const SchoolEventForm: React.FC<Props> = ({ placeSubType, grade }: Props): JSX.Element => {
    const { control, errors, setError, clearErrors, setValue} = useFormContext();    

    const formClasses = useFormStyles();
    
    const [grades, setGrades] = useState<string[]>([]);

    React.useEffect(() => {
        let gradesOptions : string[] = [];
        if (placeSubType === elementarySchool) gradesOptions = elementarySchoolGrades;
        else if (placeSubType === highSchool) gradesOptions = highSchoolGrades;
        if (placeSubType !== -1 && !grade) setValue(InteractionEventDialogFields.GRADE, gradesOptions[0]);
        setGrades(gradesOptions);
    }, [placeSubType])

    const onGradeNumberChange = (number: string) => {
        if (grade) {
            const newGrade = grade.search(numbersRegex) === -1 ? grade + number :  grade.replace(numbersRegex, number);
            setValue(newGrade, InteractionEventDialogFields.GRADE);
        }
    }

    return (
        <>
            <Grid container spacing={3} className={formClasses.formRow}>
                <Grid item xs={3}>
                    <FormInput fieldName='שם המוסד'>
                        <Controller 
                            name={InteractionEventDialogFields.PLACE_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => setValue(InteractionEventDialogFields.GRADE, grade.replace((hebrewLettersRegex), newValue))}
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
                    <>
                    <Grid item xs={3}>
                        <FormInput fieldName='כיתה'>
                            <FormControl fullWidth>
                                <InputLabel>כיתה</InputLabel>
                                <Controller 
                                    name={InteractionEventDialogFields.GRADE}
                                    control={control}
                                    render={(props) => (
                                        <Select
                                            test-id='classGrade'
                                            value={props.value?.split(numbersRegex)[0]}
                                            onChange={(event: React.ChangeEvent<any>) => props.value && props.onChange(event.target.value as string)}
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
                    <Grid item xs={3}>
                        <FormInput fieldName='מספר כיתה'>
                            <Controller 
                                name={InteractionEventDialogFields.GRADE}
                                control={control}
                                render={(props) => (
                                    <AlphanumericTextField
                                        name={props.name}
                                        errors={errors}
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        test-id='מספר כיתה'
                                        value={props.value?.split(numbersRegex)[1] || ''}
                                        onChange={newValue => onGradeNumberChange(newValue)}/>
                                )}
                            /> 
                        </FormInput>
                    </Grid>
                    </>
                }
            </Grid>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

interface Props {
    placeSubType: number;
    grade: string;
}

export default SchoolEventForm;
