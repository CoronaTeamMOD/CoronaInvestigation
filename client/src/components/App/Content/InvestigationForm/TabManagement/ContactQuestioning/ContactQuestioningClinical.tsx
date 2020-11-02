import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addDays, format } from 'date-fns';
import { Autocomplete } from '@material-ui/lab';
import { Avatar, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import theme from 'styles/theme';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import InteractedContactFields from 'models/enums/InteractedContact';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import useContactFields from 'Utils/vendor/useContactFields';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { familyRelationships, interactedContact, updateInteractedContact } = props;
    const { isFieldDisabled } = useContactFields(interactedContact.contactStatus);

    const [cityInput, setCityInput] = useState<string>('');

    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');

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
                    updateInteractedContact(interactedContact, InteractedContactFields.DOES_NEED_ISOLATION, true);
                }
            })
        :
        updateInteractedContact(interactedContact, InteractedContactFields.DOES_NEED_ISOLATION, false);
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
                        <FieldName xs={6} fieldName='קרבה משפחתית:'/>
                        <Grid item xs={6}>
                            <FormControl>
                                <Select
                                    disabled={isFieldDisabled}
                                    test-id='familyRelationshipSelect'
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
                <Grid container item>
                    <FieldName xs={6} fieldName='קשר:'/>
                    <Grid item xs={6}>
                        <AlphanumericTextField
                            disabled={isFieldDisabled}
                            testId='relationship'
                            name={InteractedContactFields.RELATIONSHIP}
                            value={interactedContact.relationship}
                            onChange={(newValue: string) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.RELATIONSHIP, newValue as string
                                )}
                            placeholder='קשר'
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid container item>
                        <FieldName xs={6} fieldName='יישוב השהייה בבידוד:' />
                        <Grid item xs={6}>
                            <Autocomplete
                                disabled={isFieldDisabled}
                                options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                getOptionLabel={(option) => option?.value ? option.value.displayName : ''}
                                inputValue={cityInput}
                                defaultValue={{ id: interactedContact.contactedPersonCity, value: cities.get(interactedContact.contactedPersonCity) }}
                                onChange={(event, selectedCity) => {
                                    const newCityInput = cities.get(interactedContact.contactedPersonCity) ? cities.get(interactedContact.contactedPersonCity)?.displayName : '';
                                    newCityInput && setCityInput(newCityInput || '');
                                    updateInteractedContact(interactedContact, InteractedContactFields.CONTACTED_PERSON_CITY, selectedCity?.id);
                                }}
                                onInputChange={(event, selectedCityName) => {
                                    setCityInput(selectedCityName);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        test-id='contactedPersonCity'
                                        id={InteractedContactFields.CONTACTED_PERSON_CITY}
                                        placeholder='עיר'
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={6} fieldName='האם נדרש סיוע עבור מקום בידוד?'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesNeedHelpInIsolation'
                            value={interactedContact.doesNeedHelpInIsolation}
                            onChange={(event, booleanValue) => booleanValue !== null && updateInteractedContact(interactedContact, InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION, booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={6} fieldName='הקמת דיווח בידוד'/>
                        <Toggle
                            disabled={isFieldDisabled}
                            test-id='doesNeedIsolation'
                            value={interactedContact.doesNeedIsolation}
                            onChange={(event, booleanValue) => booleanValue !== null && handleIsolation(booleanValue)}
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <FieldName xs={6} fieldName='תאריך סיום בידוד:'/>

                    <Grid item xs={6}>
                        <AlphanumericTextField
                            disabled={isFieldDisabled}
                            testId='isolationEndDate'
                            name='isolationEndDate'
                            value={formattedIsolationEndDate}
                            onChange={() => {
                            }}
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
