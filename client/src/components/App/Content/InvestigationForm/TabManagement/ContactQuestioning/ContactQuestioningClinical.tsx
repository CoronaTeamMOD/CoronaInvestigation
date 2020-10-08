import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Avatar, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import theme from 'styles/theme';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const { errors, setError, clearErrors } = useForm({});

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { familyRelationships, interactedContact, updateInteractedContact } = props;

    const [needsToIsolate, setNeedsToIsolate] = useState<boolean>(interactedContact.doesNeedHelpInIsolation);

    React.useEffect(() => {
        updateInteractedContact(interactedContact, InteractedContactFields.DOES_NEED_ISOLATION, needsToIsolate);
    },[needsToIsolate]);

    const handleIsolation = (value: boolean) => {
        value ?
            Swal.fire({
                icon: 'warning',
                title: 'האם אתה בטוח שתרצה להקים דיווח בידוד?',
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך',
                customClass: {
                    title: classes.swalTitle
                }
            }).then((result) => {
                if (result.value) {
                    setNeedsToIsolate(true);
                }
            })
        :
            setNeedsToIsolate(false);
    };

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
                                        familyRelationships?.length > 0 &&
                                        [emptyFamilyRelationship].concat(familyRelationships).map((familyRelationship) => (
                                            <MenuItem className={classes.menuItem}
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
                <Grid item>
                    <Grid container justify='space-between'>
                        <Typography variant='body2'><b>הקמת דיווח בידוד</b></Typography>
                        <Toggle
                            value={interactedContact.doesNeedIsolation ? interactedContact.doesNeedIsolation : needsToIsolate}
                            onChange={(event, booleanValue) => booleanValue !== null && handleIsolation(booleanValue)}
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
