import { format } from 'date-fns';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ExpandMore } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

import useStyles from './ContactQuestioningStyles';
import { RELEVANT_OCCUPATION_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const { interactedContacts } = useContext(interactedContactsContext);
    const { occupations } = useContext(occupationsContext);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const [isolationCityName, setIsolationCityName] = React.useState<string>('');

    return (
        <>
            <Typography className={classes.title} variant='body1'><b>טופס תשאול מגעים ({interactedContacts.length})</b></Typography>
            {
                interactedContacts.map((interactedContact) => (
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
                                <Grid container justify='space-evenly'>
                                    <Grid item xs={4}>
                                        <Grid container direction='column' spacing={4}>
                                            <Grid container item direction='row' alignItems='center'>
                                                <Avatar className={classes.avatar}>1</Avatar>
                                                <Typography><b>פרטים אישיים נוספים</b></Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container>
                                                    <Grid item xs={3}>
                                                        <Typography variant='body2' className={classes.text}><b>תעודה מזהה:</b></Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Toggle
                                                            firstOption={'ת.ז'}
                                                            secondOption={'דרכון'}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography variant='body2' className={classes.text}><b>מספר תעודה:</b></Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField className={classes.idTextField} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <FormInput fieldName='תאריך לידה'>
                                                    <DatePick value={null} onChange={() => { }} />
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
                                        <Grid container direction='column' spacing={4}>
                                            <Grid container item direction='row' alignItems='center'>
                                                <Avatar className={classes.avatar}>2</Avatar>
                                                <Typography><b>פרטי מגע וכניסה לבידוד</b></Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Typography variant='body2' className={classes.text}><b>קרבה מפחתית:</b></Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField className={classes.textField} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <FormInput fieldName='קשר'>
                                                    <TextField className={classes.textField} />
                                                </FormInput>
                                            </Grid>
                                            <Grid item>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Typography variant='body2' className={classes.text}><b>יישוב השהייה בבידוד:</b></Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Autocomplete
                                                            className={classes.autocompleteTextField}
                                                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                                            getOptionLabel={(option) => option.value.displayName}
                                                            inputValue={isolationCityName}
                                                            onChange={(event, selectedCity) => {}}
                                                            onInputChange={(event, selectedCityName) => {
                                                                setIsolationCityName(selectedCityName);
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    {...params}
                                                                    placeholder='עיר'
                                                                />
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2'><b>האם נדרש סיוע עבור מקום בידוד?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider orientation='vertical' variant='middle' light={true}/>
                                    <Grid item xs={4}>
                                        <Grid container direction='column' spacing={4}>
                                            <Grid container item direction='row' alignItems='center'>
                                                <Avatar className={classes.avatar}>3</Avatar>
                                                <Typography><b>תשאול לצורך הפנייה לבדיקה</b></Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2' className={classes.text}><b>האם חש בטוב?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2' className={classes.text}><b>האם סובל ממחלות רקע?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2' className={classes.text}><b>האם חי באותו הבית עם המאומת?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2' className={classes.text}><b>מפגש חוזר עם המאומת?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Typography variant='body2' className={classes.text}><b>עבודה עם קהל במסגרת העבודה?</b></Typography>
                                                    <Toggle/>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify='space-between'>
                                                    <Grid item xs={7}>
                                                        <Typography variant='body2' className={classes.text}><b>{RELEVANT_OCCUPATION_LABEL}</b></Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormControl>
                                                            <RadioGroup value={null}>
                                                                {
                                                                    occupations.map((occupation) => {
                                                                        return <FormControlLabel
                                                                            value={occupation}
                                                                            key={occupation}
                                                                            control={
                                                                                <Radio
                                                                                    color='primary'
                                                                                    onChange={(event) => {
                                                                                        { }
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
