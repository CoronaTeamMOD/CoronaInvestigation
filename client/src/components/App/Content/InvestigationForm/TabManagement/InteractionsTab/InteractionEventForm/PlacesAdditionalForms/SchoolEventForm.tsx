import React, {useContext, useState} from 'react';
import {FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy, {getSubtypeCodeByName} from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

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

const SchoolEventForm : React.FC = () : JSX.Element => {

    const elementarySchool = getSubtypeCodeByName(placeTypesCodesHierarchy.school.code, 'elementarySchool');
    const highSchool = getSubtypeCodeByName(placeTypesCodesHierarchy.school.code, 'highSchool');

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

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});
    
    return (
        <>
                {
                    grades.length > 0 &&
                    <Grid item xs={6}>
                        <FormInput fieldName='כיתה'>
                        <FormControl fullWidth>
                            <InputLabel>כיתה</InputLabel>
                            <Select
                                label='כיתה'
                                value={interactionEventDialogData.grade}
                                onChange={(event: React.ChangeEvent<any>) => onChange(event, InteractionEventDialogFields.GRADE)}
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
        </>
    );
};

export default SchoolEventForm;