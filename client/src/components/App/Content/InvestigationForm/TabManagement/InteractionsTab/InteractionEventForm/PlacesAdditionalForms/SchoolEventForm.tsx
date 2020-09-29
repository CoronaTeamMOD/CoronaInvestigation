import { useForm } from "react-hook-form";
import React, {useContext, useState} from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
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

const SchoolEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { placeSubType, grade } = interactionEventDialogData;

    const [grades, setGrades] = useState<string[]>([]);

    React.useEffect(() => {
        let gradesOptions : string[] = [];
        if (placeSubType === elementarySchool) gradesOptions = elementarySchoolGrades;
        else if (placeSubType === highSchool) gradesOptions = highSchoolGrades;
        if (placeSubType !== -1 && !grade) onChange(gradesOptions[0], InteractionEventDialogFields.GRADE);
        setGrades(gradesOptions);
    }, [placeSubType])

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue});
    
    const onGradeNumberChange = (number: string) => {
        if (grade) {
            const newGrade = grade.search(numbersRegex) === -1 ? grade + number :  grade.replace(numbersRegex, number);
            onChange(newGrade, InteractionEventDialogFields.GRADE);
        }
    }
    
    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={3}>
                    <FormInput fieldName='שם המוסד'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.PLACE_NAME}
                            value={interactionEventDialogData.placeName}
                            onChange={newValue => onChange(newValue, InteractionEventDialogFields.PLACE_NAME)}/>
                    </FormInput>
                </Grid>
                {
                    grades.length > 0 &&
                    <>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                        <FormInput fieldName='כיתה'>
                            <FormControl fullWidth>
                                <InputLabel>כיתה</InputLabel>
                                <Select
                                    test-id={'classGrade'}
                                    label='כיתה'
                                    value={grade?.split(numbersRegex)[0]}
                                    onChange={(event: React.ChangeEvent<any>) => grade && onChange(grade.replace((hebrewLettersRegex), event.target.value), InteractionEventDialogFields.GRADE)}
                                >
                                {
                                    grades.map((currentGrade) => (
                                        <MenuItem key={currentGrade} value={currentGrade}>{currentGrade}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        </FormInput>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                        <FormInput fieldName='מספר כיתה'>
                            <AlphanumericTextField
                                errors={errors}
                                setError={setError}
                                clearErrors={clearErrors}
                                name={InteractionEventDialogFields.GRADE}
                                value={grade?.split(numbersRegex)[1] || ''}
                                onChange={newValue => onGradeNumberChange(newValue)}/>
                        </FormInput>
                    </Grid>
                    </>
                }
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default SchoolEventForm;