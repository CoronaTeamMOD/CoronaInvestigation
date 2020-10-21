import React, { useContext } from 'react';
import { Avatar, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import InteractedContact from 'models/InteractedContact';
import InteractedContactFields from 'models/enums/InteractedContact';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';

import useStyles from './ContactQuestioningStyles';
import { OCCUPATION_LABEL, RELEVANT_OCCUPATION_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioningCheck: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { occupations } = useContext(occupationsContext);

    const { interactedContact, updateInteractedContact } = props;

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>3</Avatar>
                    <Typography><b>תשאול לצורך הפנייה לבדיקה</b></Typography>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2' className={classes.text}><b>האם חש בטוב?</b></Typography>
                        <Toggle
                            test-id='doesFeelGood'
                            value={interactedContact.doesFeelGood}
                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_FEEL_GOOD, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2' className={classes.text}><b>האם סובל ממחלות רקע?</b></Typography>
                        <Toggle
                            test-id='doesHaveBackgroundDiseases'
                            value={interactedContact.doesHaveBackgroundDiseases}
                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2' className={classes.text}><b>האם חי באותו הבית עם המאומת?</b></Typography>
                        <Toggle
                            test-id='doesLiveWithConfirmed'
                            value={interactedContact.doesLiveWithConfirmed}
                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_LIVE_WITH_CONFIRMED, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2' className={classes.text}><b>מפגש חוזר עם המאומת?</b></Typography>
                        <Toggle
                            test-id='repeatingOccuranceWithConfirmed'
                            value={interactedContact.repeatingOccuranceWithConfirmed}
                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2' className={classes.text}><b>עבודה עם קהל במסגרת העבודה?</b></Typography>
                        <Toggle
                            test-id='doesWorkWithCrowd'
                            value={interactedContact.doesWorkWithCrowd}
                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_WORK_WITH_CROWD, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <Grid item xs={7}>
                            <Typography variant='body2' className={classes.text}><b>{RELEVANT_OCCUPATION_LABEL}</b></Typography>
                        </Grid>
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
