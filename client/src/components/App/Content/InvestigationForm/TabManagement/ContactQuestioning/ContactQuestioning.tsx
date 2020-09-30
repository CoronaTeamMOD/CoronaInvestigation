import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { differenceInYears, format } from 'date-fns';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Checkbox, Divider, FormControl,
         FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import useContactQuestioning from './useContactQuestioning';
import FamilyRelationship from 'models/enums/FamilyRelationship';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import { ADDITIONAL_PHONE_LABEL, OCCUPATION_LABEL, RELEVANT_OCCUPATION_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const { errors, setError, clearErrors } = useForm({});

    const interactedContactsState = useContext(interactedContactsContext);
    const { occupations } = useContext(occupationsContext);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const [familyRelationships, setFamilyRelationships] = React.useState<FamilyRelationship[]>();
    const [currentInteractedContact, setCurrentInteractedContact] = React.useState<InteractedContact>();

    const updateInteractedContact = (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => {
        setCurrentInteractedContact(interactedContact);
        let contactIndex = interactedContactsState.interactedContacts.findIndex(contact => contact.id === interactedContact.id)
        interactedContactsState.interactedContacts[contactIndex] = { ...interactedContactsState.interactedContacts[contactIndex], [fieldToUpdate]: value };
    };

    const changeIdentificationType = (interactedContact: InteractedContact, booleanValue: boolean) => {
        const newIdentificationType = booleanValue ? IdentificationTypes.PASSPORT : IdentificationTypes.ID;
        updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_TYPE, newIdentificationType);
    };

    const { getAllRelationships, saveContact } = useContactQuestioning({ setFamilyRelationships });

    React.useEffect(() => {
        getAllRelationships();
    },[]);

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
                                    onClick={() => updateInteractedContact(interactedContact, InteractedContactFields.CANT_REACH_CONTACT, false)}
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
                                                        onChange={((event: any, checked: boolean) => updateInteractedContact(interactedContact, InteractedContactFields.CANT_REACH_CONTACT, checked))}
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
                                                                name={InteractedContactFields.IDENTIFICATION_NUMBER}
                                                                placeholder='מספר תעודה'
                                                                className={classes.idTextField}
                                                                value={interactedContact.identificationNumber}
                                                                onChange={(newValue: string) =>
                                                                    updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_NUMBER, newValue as string
                                                                )}
                                                                setError={setError}
                                                                clearErrors={clearErrors}
                                                                errors={errors}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <FormInput fieldName='תאריך לידה'>
                                                        <DatePick
                                                            value={new Date(interactedContact.birthDate)}
                                                            onChange={(newDate: Date) =>
                                                                updateInteractedContact(interactedContact, InteractedContactFields.BIRTH_DATE, newDate
                                                                )
                                                            }
                                                        />
                                                    </FormInput>
                                                </Grid>
                                                <Grid item>
                                                    <FormInput fieldName='גיל'>
                                                        <AlphanumericTextField
                                                            name={'age'}
                                                            placeholder='הכנס גיל:'
                                                            value={differenceInYears(new Date(), new Date(interactedContact.birthDate as Date))}
                                                            onChange={() =>{}}
                                                            setError={setError}
                                                            clearErrors={clearErrors}
                                                            errors={errors}
                                                        />
                                                    </FormInput>
                                                </Grid>
                                                <Grid item>
                                                    <FormInput fieldName={ADDITIONAL_PHONE_LABEL}>
                                                        <AlphanumericTextField
                                                            name={InteractedContactFields.ADDITIONAL_PHONE_NUMBER}
                                                            placeholder='הכנס טלפון:'
                                                            value={interactedContact.additionalPhoneNumber}
                                                            onChange={(newValue: string) =>
                                                                updateInteractedContact(interactedContact, InteractedContactFields.ADDITIONAL_PHONE_NUMBER, newValue
                                                                )}
                                                            setError={setError}
                                                            clearErrors={clearErrors}
                                                            errors={errors}
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
                                                            <Typography variant='body2' className={classes.text}><b>קרבה משפחתית:</b></Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl>
                                                                <Select
                                                                    name={InteractedContactFields.FAMILY_RELATIONSHIP}
                                                                    placeholder='קרבה משפחתית'
                                                                    value={interactedContact.familyRelationship}
                                                                    onChange={(event) =>
                                                                        updateInteractedContact(interactedContact, InteractedContactFields.FAMILY_RELATIONSHIP, event.target.value
                                                                    )}
                                                                >
                                                                    {
                                                                        familyRelationships?.map((familyRelationship) => (
                                                                            <MenuItem
                                                                                key={familyRelationship.id}
                                                                                value={familyRelationship.id}>
                                                                                {familyRelationship.displayName}
                                                                            </MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <FormInput fieldName='קשר'>
                                                        <AlphanumericTextField
                                                            name={InteractedContactFields.RELATIONSHIP}
                                                            placeholder='קשר'
                                                            value={interactedContact.relationship}
                                                            onChange={(newValue: string) =>
                                                                updateInteractedContact(interactedContact, InteractedContactFields.RELATIONSHIP, newValue as string
                                                            )}
                                                            setError={setError}
                                                            clearErrors={clearErrors}
                                                            errors={errors}
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
                                                                options={Array.from(cities, ([cityId, value]) => ({ cityId, value }))}
                                                                getOptionLabel={(option) => option.value.displayName}
                                                                inputValue={interactedContact.contactedPersonCity?.displayName}
                                                                onChange={(event, selectedCity) => {
                                                                    updateInteractedContact(interactedContact, InteractedContactFields.CONTACTED_PERSON_CITY, selectedCity?.value);
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField
                                                                        {...params}
                                                                        id={InteractedContactFields.CONTACTED_PERSON_CITY}
                                                                        placeholder='עיר'
                                                                        value={interactedContact.contactedPersonCity}
                                                                    />
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container justify='space-between'>
                                                        <Typography variant='body2'><b>האם נדרש סיוע עבור מקום בידוד?</b></Typography>
                                                        <Toggle
                                                            value={interactedContact.doesNeedHelpInIsolation}
                                                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION, booleanValue)}
                                                        />
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
                                                        <Toggle
                                                            value={interactedContact.doesFeelGood}
                                                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_FEEL_GOOD, booleanValue)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container justify='space-between'>
                                                        <Typography variant='body2' className={classes.text}><b>האם סובל ממחלות רקע?</b></Typography>
                                                        <Toggle
                                                            value={interactedContact.doesHaveBackgroundDiseases}
                                                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES, booleanValue)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container justify='space-between'>
                                                        <Typography variant='body2' className={classes.text}><b>האם חי באותו הבית עם המאומת?</b></Typography>
                                                        <Toggle
                                                            value={interactedContact.doesLiveWithConfirmed}
                                                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.DOES_LIVE_WITH_CONFIRMED, booleanValue)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container justify='space-between'>
                                                        <Typography variant='body2' className={classes.text}><b>מפגש חוזר עם המאומת?</b></Typography>
                                                        <Toggle
                                                            value={interactedContact.repeatingOccuranceWithConfirmed}
                                                            onChange={(event, booleanValue) => updateInteractedContact(interactedContact, InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED, booleanValue)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container justify='space-between'>
                                                        <Typography variant='body2' className={classes.text}><b>עבודה עם קהל במסגרת העבודה?</b></Typography>
                                                        <Toggle
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
                                    </Grid>
                                </AccordionDetails>
                                <PrimaryButton style={{marginRight: '1.5vw'}} onClick={() => saveContact(interactedContact)}>שמור מגע</PrimaryButton>
                            </Accordion>
                        </div>
                ))
            }
        </>
    )
};

export default ContactQuestioning;
