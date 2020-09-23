import React, {useContext, useState} from 'react';
import {FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@material-ui/core';
import { useForm } from "react-hook-form";

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

const { elementarySchool, highSchool } = placeTypesCodesHierarchy.school.subTypesCodes;

const SchoolEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { placeSubType } = interactionEventDialogData;

    const [grades, setGrades] = useState<string[]>([]);
    
    React.useEffect(() => {
        let gradesOptions : string[] = [];
        if (placeSubType === elementarySchool) gradesOptions = elementarySchoolGrades;
        else if (placeSubType === highSchool) gradesOptions = highSchoolGrades;
        if (placeSubType > 0) setInteractionEventDialogData({...interactionEventDialogData, grade: gradesOptions[0]});
        setGrades(gradesOptions);
    }, [placeSubType])

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue});
    
    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={2}>
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
                    <Grid item xs={2}>
                        <FormInput fieldName='כיתה'>
                        <FormControl fullWidth>
                            <InputLabel>כיתה</InputLabel>
                            <Select
                                test-id={'classGrade'}
                                label='כיתה'
                                value={interactionEventDialogData.grade}
                                onChange={(event: React.ChangeEvent<any>) => onChange(event.target.value, InteractionEventDialogFields.GRADE)}
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
                }
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default SchoolEventForm;