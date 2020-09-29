import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

const { publicPark, zoo, stadium, amphitheater, beach } = placeTypesCodesHierarchy.otherPublicPlaces.subTypesCodes;

const wideAreas = [
    publicPark,
    zoo,
    stadium,
    amphitheater,
    beach
]

const OtherPublicLocationForm : React.FC<Props> = ({ placeSubType }: Props) : JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();

    const isWideArea : boolean = wideAreas.includes(placeSubType);    

    return (
        <>
            <Grid item xs={2}>
                <FormInput fieldName='שם המוסד'>
                    <Controller 
                        name={InteractionEventDialogFields.PLACE_NAME}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                onBlur={props.onBlur}
                                errors={errors}
                                setError={setError}
                                clearErrors={clearErrors}
                            />
                        )}
                    />
                </FormInput>
            </Grid>
            <AddressForm/>
            {
                !isWideArea && <BusinessContactForm/>
            }
        </>
    );
};

interface Props {
    placeSubType: number;
}

export default OtherPublicLocationForm;