import React from 'react';
import { Grid, Tooltip, Typography } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphabetWithDashTextField from 'commons/AlphabetWithDashTextField/AlphabetWithDashTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import NumericTextField from 'commons/NumericTextField/NumericTextField';

const businessContactFirstNameField = 'שם פרטי';
const businessContactLastNameField = 'שם משפחה';
const businessContactNumField = 'טלפון';

const BusinessContactForm: React.FC<BusinessContactFormProps> = ({shouldTooltipAppear}: BusinessContactFormProps): JSX.Element => {
        
    const { control } = useFormContext();

    const formClasses = useFormStyles();

    return (
        <div>
            <Typography variant='body1' className={formClasses.fieldName}>פרטי איש קשר:</Typography>
            <Tooltip title={shouldTooltipAppear ? 'נדרש לציין פרטי איש הקשר שברשותו המידע על המקום והמקרים הנוספים' : ''} arrow>
            <Grid container className={formClasses.formRow}>
                <FormInput xs={4} fieldName={businessContactFirstNameField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_FIRST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphabetWithDashTextField
                                    testId='businessContactFirstName'
                                    name={props.name}
                                    value={props.value ? props.value : null}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                </FormInput>
                <FormInput xs={4} fieldName={businessContactLastNameField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_LAST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphabetWithDashTextField
                                    testId='businessContactLastName'
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                </FormInput>
                <FormInput xs={4} fieldName={businessContactNumField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER}
                            control={control}
                            render={(props) => (
                                <NumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                </FormInput>
            </Grid>
            </Tooltip>
        </div>
    );
};

export interface BusinessContactFormProps {
    shouldTooltipAppear?: boolean;
};

export default BusinessContactForm;
