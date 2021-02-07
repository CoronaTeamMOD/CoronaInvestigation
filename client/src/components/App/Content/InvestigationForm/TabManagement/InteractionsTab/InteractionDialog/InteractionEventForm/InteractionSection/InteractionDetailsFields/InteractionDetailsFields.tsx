import React, {useMemo} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import TimeForm from './InteractionTimeForm';
import ExternalizationForm from './InteractionExternalizationForm/InteractionExternalizationForm';
import repetitiveFieldTools from '../RepetitiveEventForm/hooks/repetitiveFieldTools';

const InteractionDetailsFields = ({index, interactionDate}: Props) => {
    const {control, watch} = useFormContext();

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const placeSubType = watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    const {isNamedLocation} = useMemo(() => getOptionsByPlaceAndSubplaceType(placeType, placeSubType), [placeType, placeSubType]);

    const {generateFieldName} = repetitiveFieldTools(index);

    return (
        <>
            <TimeForm occurrenceIndex={index} interactionDate={interactionDate} />

            {
                isNamedLocation &&
                <FormInput xs={7} labelLength={3} fieldName='פירוט נוסף'>
                    <Controller control={control}
                                name={generateFieldName(InteractionEventDialogFields.PLACE_DESCRIPTION)}
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

            <ExternalizationForm occurrenceIndex={index}/>
        </>
    );
};

interface Props {
    index?: number;
    interactionDate: Date;
}

export default InteractionDetailsFields;