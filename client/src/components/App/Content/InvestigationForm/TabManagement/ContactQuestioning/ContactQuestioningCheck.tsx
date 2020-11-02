import React, { useContext } from 'react';
import { Avatar, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import InteractedContact from 'models/InteractedContact';
import InteractedContactFields from 'models/enums/InteractedContact';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import FieldName from 'commons/FieldName/FieldName';

import useStyles from './ContactQuestioningStyles';
import { OCCUPATION_LABEL, RELEVANT_OCCUPATION_LABEL } from '../PersonalInfoTab/PersonalInfoTab';
import useContactFields from 'Utils/vendor/useContactFields';

const ContactQuestioningCheck: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { occupations } = useContext(occupationsContext);
    const { interactedContact, updateInteractedContact } = props;
    const { isFieldDisabled } = useContactFields(interactedContact.contactStatus);

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>3</Avatar>
                    <Typography><b>תשאול לצורך הפנייה לבדיקה</b></Typography>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם חש בטוב?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesFeelGood'
                            value={interactedContact.doesFeelGood}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.DOES_FEEL_GOOD, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם סובל ממחלות רקע?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesHaveBackgroundDiseases'
                            value={interactedContact.doesHaveBackgroundDiseases}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם חי באותו הבית עם המאומת?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesLiveWithConfirmed'
                            value={interactedContact.doesLiveWithConfirmed}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.DOES_LIVE_WITH_CONFIRMED, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='מפגש חוזר עם המאומת?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='repeatingOccuranceWithConfirmed'
                            value={interactedContact.repeatingOccuranceWithConfirmed}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='עבודה עם קהל במסגרת העבודה?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesWorkWithCrowd'
                            value={interactedContact.doesWorkWithCrowd}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.DOES_WORK_WITH_CROWD, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={7} fieldName={RELEVANT_OCCUPATION_LABEL}/>
                        <Grid item xs={5}>
                            <FormControl>
                                <RadioGroup
                                    aria-label={OCCUPATION_LABEL}
                                    name={OCCUPATION_LABEL}
                                    value={interactedContact.occupation}>
                                    {
                                        occupations.map((occupation) => {
                                            return <FormControlLabel
                                                value={occupation}
                                                key={occupation}
                                                control={
                                                    <Radio
                                                        disabled={isFieldDisabled}
                                                        color='primary'
                                                        onChange={(event) => {
                                                            updateInteractedContact(interactedContact, InteractedContactFields.OCCUPATION, event.target.value)
                                                        }}
                                                    />
                                                }
                                                label={occupation}
                                            />
                                        })
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default ContactQuestioningCheck;

interface Props {
    interactedContact: InteractedContact;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
};
