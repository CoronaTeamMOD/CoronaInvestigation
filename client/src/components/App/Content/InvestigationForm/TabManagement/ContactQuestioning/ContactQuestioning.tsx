import { Accordion, AccordionDetails, AccordionSummary, Avatar, Divider, Grid, TextField, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';
import React from 'react';
import useStyles from './ContactQuestioningStyles';

const ContactQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid container item xs={6} justify='space-between'>
                        <Typography variant='body2'>
                            <b>שם פרטי:</b> נעמן
                        </Typography>
                        <Typography variant='body2'>
                            <b>שם משפחה:</b> צור
                        </Typography>
                        <Typography variant='body2'>
                            <b>מספר טלפון:</b> 0504499136
                        </Typography>
                        <Typography variant='body2'>
                            <b>סוג מגע:</b> הדוק
                        </Typography>
                        <Typography variant='body2'>
                            <b>פירוט אופי המגע:</b> עובדים יחד במשרד
                        </Typography>
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
                        <Grid item xs={3}>
                            second
                        </Grid>
                        <Grid item xs={5}>
                            third
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    )
};

export default ContactQuestioning;