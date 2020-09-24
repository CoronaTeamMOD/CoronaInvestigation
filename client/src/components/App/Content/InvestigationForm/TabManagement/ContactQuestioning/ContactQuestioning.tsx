import { format } from 'date-fns';
import React, { useContext } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Divider, Grid, TextField, Typography } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';

import useStyles from './ContactQuestioningStyles';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

const ContactQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const context = useContext(interactedContactsContext);

    return (
        <>
            <Typography className={classes.title} variant='body1'><b>טופס תשאול מגעים ({context.interactedContacts.length})</b></Typography>
            {
                context.interactedContacts.map((interactedContact) => (
                    <div className={classes.form}>
                        <Accordion className={classes.accordion} style={{ borderRadius: '3vw'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                            >
                                <Grid container item xs={9} justify='space-between'>
                                    <Typography variant='body2'>
                                        <b>שם פרטי:</b> {interactedContact.firstName}
                                    </Typography>
                                    <Typography variant='body2'>
                                        <b>שם משפחה:</b> {interactedContact.lastName}
                                    </Typography>
                                    <Typography variant='body2'>
                                        <b>מספר טלפון:</b> {interactedContact.phoneNumber}
                                    </Typography>
                                    <Typography variant='body2'>
                                        <b>תאריך המגע:</b> {format(new Date(interactedContact.contactDate), 'dd/MM/yyyy')}
                                    </Typography>
                                    <Typography variant='body2'>
                                        <b>סוג מגע:</b> {interactedContact.contactType}
                                    </Typography>
                                    {
                                        interactedContact.extraInfo &&
                                        <Typography variant='body2'>
                                            <b>פירוט אופי המגע:</b> {interactedContact.extraInfo}
                                        </Typography>
                                    }
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Grid container direction='column' spacing={4}>
                                            <Grid container item direction='row' alignItems='center'>
                                                <Avatar className={classes.avatar}>1</Avatar>
                                                <Typography><b>פרטים אישיים נוספים</b></Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container>
                                                    <FormInput fieldName='סוג תעודה מזהה'>
                                                        <ToggleButtonGroup exclusive size='small'>
                                                            <ToggleButton selected>
                                                                ת.ז
                                                </ToggleButton>
                                                            <ToggleButton>
                                                                דרכון
                                                </ToggleButton>
                                                        </ToggleButtonGroup>
                                                    </FormInput>
                                                    <FormInput fieldName='מספר תעודה מזהה'>
                                                        <TextField />
                                                    </FormInput>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <FormInput fieldName='תאריך לידה'>
                                                    <DatePick value='dd/mm/yyyy' onChange={() => { }} />
                                                </FormInput>
                                            </Grid>
                                            <Grid item>
                                                <FormInput fieldName='גיל'>
                                                    <TextField />
                                                </FormInput>
                                            </Grid>
                                            <Grid item>
                                                <FormInput fieldName='טלפון נוסף'>
                                                    <TextField />
                                                </FormInput>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider orientation='vertical' variant='middle' light={true}/>
                                    <Grid item xs={3}>
                                        second
                                    </Grid>
                                    <Divider orientation='vertical' variant='middle' light={true}/>
                                    <Grid item xs={3}>
                                        third
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                ))
            }
        </>
    )
};

export default ContactQuestioning;
