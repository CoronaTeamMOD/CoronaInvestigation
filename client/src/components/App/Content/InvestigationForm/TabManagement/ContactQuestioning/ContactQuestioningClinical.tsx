import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Avatar, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/enums/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const { errors, setError, clearErrors } = useForm({});

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { familyRelationships, interactedContact, updateInteractedContact } = props;

    return (
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
                                        familyRelationships.map((familyRelationship) => (
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
                                inputValue={cities.get(interactedContact.contactedPersonCity)?.displayName}
                                onChange={(event, selectedCity) => {
                                    updateInteractedContact(interactedContact, InteractedContactFields.CONTACTED_PERSON_CITY, selectedCity?.cityId);
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
    )
};

export default ContactQuestioningClinical;

interface Props {
    familyRelationships: FamilyRelationship[];
    interactedContact: InteractedContact;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
};
