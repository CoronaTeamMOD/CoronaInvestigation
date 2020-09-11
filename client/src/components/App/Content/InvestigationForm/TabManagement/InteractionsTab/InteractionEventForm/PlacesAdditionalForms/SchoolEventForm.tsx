import React, {useContext, useState} from 'react';
import {Grid} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

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

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});
    
    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם המוסד'>
                        <CircleTextField
                            value={interactionEventDialogData.placeName}
                            onChange={event => onChange(event, InteractionEventDialogFields.PLACE_NAME)}/>
                    </FormInput>
                </Grid>
                {
                    grades.length > 0 &&
                    <Grid item xs={6}>
                        <FormInput fieldName='כיתה'>
                            <CircleSelect
                                value={interactionEventDialogData.grade}
                                onChange={(event: React.ChangeEvent<any>) => onChange(event, InteractionEventDialogFields.GRADE)}
                                className={formClasses.formSelect}
                                options={grades}
                            />
                        </FormInput>
                    </Grid>
                }
            </div>
            <AddressForm removeFloor/>
            <BusinessContactForm/>
        </>
    );
};

export default SchoolEventForm;