import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import useFormStyles from 'styles/formStyles';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const OfficeEventForm : React.FC = () : JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();

    const formClasses = useFormStyles();

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='שם המשרד'>
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
            </div>
            <AddressForm/>
        </>
    );
};

export default OfficeEventForm;