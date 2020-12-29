import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

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

const SchoolEventForm: React.FC = (): JSX.Element => {
    const { control, setValue, watch } = useFormContext();

    const formClasses = useFormStyles();
    
    const [grades, setGrades] = useState<string[]>([]);
    // @ts-ignore
    const { elementarySchool, highSchool } = placeTypesCodesHierarchy.school.subTypesCodes;
    const placeSubType = watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    React.useEffect(() => {
        let gradesOptions : string[] = [];
        if (placeSubType === elementarySchool.code) gradesOptions = elementarySchoolGrades;
        else if (placeSubType === highSchool.code) gradesOptions = highSchoolGrades;
        if (placeSubType) setValue(InteractionEventDialogFields.GRADE, gradesOptions[0]);
        setGrades(gradesOptions);
    }, [placeSubType]);

    return (
        <>
                {
                    grades.length > 0 &&
                    <div className={formClasses.formRow}>
                        <FormInput xs={2} fieldName='כיתה'>
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
                    </div>
                }
        </>
    );
};

export default SchoolEventForm;
