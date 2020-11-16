import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const HospitalEventForm : React.FC = () : JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();

    return (
        <>
            <div className={formClasses.formRow}>
                    <FormInput xs={2} fieldName='מחלקה'>
                        <Controller 
                            name={InteractionEventDialogFields.HOSPITAL_DEPARTMENT}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </div>
        </>
    );
};

export default HospitalEventForm;
