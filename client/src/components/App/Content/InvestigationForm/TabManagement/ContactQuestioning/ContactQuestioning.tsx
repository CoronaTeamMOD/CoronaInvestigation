import classes from '*.module.css';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react';
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
                            first
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