import React, {useMemo} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import TimeForm from './InteractionTimeForm';
import ExternalizationForm from './InteractionExternalizationForm/InteractionExternalizationForm';

const InteractionDetailsFields = () => {
    const {control, watch} = useFormContext();

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const placeSubType = watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    const {isNamedLocation} = useMemo(() => getOptionsByPlaceAndSubplaceType(placeType, placeSubType), [placeType, placeSubType]);

    return (
        <>
            <TimeForm/>

            {
                isNamedLocation &&
                <FormInput xs={5} labelLength={3} fieldName='פירוט נוסף'>
                    <Controller control={control}
                                name={InteractionEventDialogFields.PLACE_DESCRIPTION}
                                render={(props) => (
                                    <AlphanumericTextField
                                        name={props.name}
                                        value={props.value}
                                        onChange={props.onChange}
                                        onBlur={props.onBlur}
                                    />
                                )}
                    />
                </FormInput>
            }

            <ExternalizationForm/>
        </>
    );
};

export default InteractionDetailsFields;