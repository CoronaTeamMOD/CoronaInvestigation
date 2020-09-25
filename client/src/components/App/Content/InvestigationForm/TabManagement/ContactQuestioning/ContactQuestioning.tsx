import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { differenceInYears, format } from 'date-fns';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Checkbox, Divider, FormControl,
         FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import { ADDITIONAL_PHONE_LABEL, RELEVANT_OCCUPATION_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const interactedContactsState = useContext(interactedContactsContext);
    const { occupations } = useContext(occupationsContext);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [currentInteractedContact, setCurrentInteractedContact] = React.useState<InteractedContact>();

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: any, value: any) => {
        setCurrentInteractedContact(interactedContact);
        let contactIndex = interactedContactsState.interactedContacts.findIndex(contact => contact.id === interactedContact.id)
        interactedContactsState.interactedContacts[contactIndex] = { ...interactedContactsState.interactedContacts[contactIndex], [fieldToUpdate]: value };
    };

    const changeIdentificationType = (interactedContact: InteractedContact, booleanValue: any) => {
        const newIdentificationType = booleanValue ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
        updateInteractedContact(interactedContact, 'identificationType', newIdentificationType);
    }

    return (
        <>
            <Typography className={classes.title} variant='body1'><b>טופס תשאול מגעים ({interactedContactsState.interactedContacts.length})</b></Typography>
            {
                interactedContactsState.interactedContacts.sort((firstInteractedContact, secondInteractedContact) =>
                    firstInteractedContact.lastName.localeCompare(secondInteractedContact.lastName)).map((interactedContact) => (
                        <div key={interactedContact.id} className={classes.form}>
                            <Accordion className={classes.accordion} style={{ borderRadius: '3vw'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    onClick={() => updateInteractedContact(interactedContact, 'cantReachContact', false)}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                    dir='ltr'
                                >
                                    <Grid item xs={2}>
                                        <Grid container>
                                            <Grid item xs={9}>
                                                <Grid container>
                                                    <FormControlLabel
                                                        onClick={(event) => event.stopPropagation()}
                                                        onChange={((event: any, checked: boolean) => updateInteractedContact(interactedContact, 'cantReachContact', checked))}
                                                        control={
                                                            <Checkbox
                                                                color='primary'
                                                                checked={currentInteractedContact === interactedContact ? currentInteractedContact?.cantReachContact : interactedContact.cantReachContact}
                                                            />
                                                        }
                                                        label='אין מענה'
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Divider variant='fullWidth' orientation='vertical' flexItem />
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={10} direction='row-reverse' alignItems='center' justify='space-between'>
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
                                        {
                                            interactedContact.contactType &&
                                            <Typography variant='body2'>
                                                <b>סוג מגע:</b> {interactedContact.contactType}
                                            </Typography>
                                        }
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
                                                                value={interactedContact.identificationType !== IdentificationTypes.ID}
                                                                onChange={(event, booleanValue) => changeIdentificationType(interactedContact, booleanValue)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Typography variant='body2' className={classes.text}><b>מספר תעודה:</b></Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <AlphanumericTextField
                                                                required
                                                                name={'identificationNumber'}
                                                                placeholder='מספר תעודה'
                                                                className={classes.idTextField}
                                                                value={interactedContact.identificationNumber}
                                                                onChange={(newValue: string) =>
                                                                    updateInteractedContact(interactedContact, 'identificationNumber', newValue as string
                                                                )}
                                                                setError={()=>{}}
                                                                clearErrors={()=>{}}
                                                                errors={()=>{}}
                                                            />
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
                                                        <AlphanumericTextField
                                                            name={'age'}
                                                            placeholder='הכנס גיל:'
                                                            value={differenceInYears(new Date(), new Date(interactedContact.birthDate as Date))}
                                                            onChange={(newValue: string) =>
                                                                updateInteractedContact(interactedContact, '', newValue as string
                                                            )}
                                                            setError={()=>{}}
                                                            clearErrors={()=>{}}
                                                            errors={()=>{}}
                                                        />
                                                    </FormInput>
                                                </Grid>
                                                <Grid item>
                                                    <FormInput fieldName={ADDITIONAL_PHONE_LABEL}>
                                                        <PhoneNumberTextField
                                                            name={'additionalPhoneNumber'}
                                                            placeholder='הכנס טלפון:'
                                                            value={interactedContact.additionalPhoneNumber?.number}
                                                            onChange={(event) =>
                                                                updateInteractedContact(interactedContact, 'additionalPhoneNumber', { ...interactedContact.additionalPhoneNumber, number: event.target.value }
                                                            )}
                                                            isValid={interactedContact.additionalPhoneNumber?.isValid as boolean}
                                                            setIsValid={(isValid) =>
                                                                updateInteractedContact(interactedContact, 'additionalPhoneNumber',
                                                                    { ...interactedContact.additionalPhoneNumber, isValid }
                                                                )
                                                            }
                                                        />
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
                                                        <AlphanumericTextField
                                                            required
                                                            name={'relationship'}
                                                            placeholder='קשר'
                                                            value={interactedContact.relationship}
                                                            onChange={(newValue: string) =>
                                                                updateInteractedContact(interactedContact, 'relationship', newValue as string
                                                            )}
                                                            setError={()=>{}}
                                                            clearErrors={()=>{}}
                                                            errors={()=>{}}
                                                        />
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
