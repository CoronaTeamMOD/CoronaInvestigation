import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';


const OfficeEventForm: React.FC = (): JSX.Element => {
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
