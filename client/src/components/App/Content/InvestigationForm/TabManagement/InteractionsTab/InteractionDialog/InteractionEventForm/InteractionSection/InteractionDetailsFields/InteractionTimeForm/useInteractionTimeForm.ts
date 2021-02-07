import {isValid} from 'date-fns';
import {useFormContext} from 'react-hook-form';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import repetitiveFieldTools from '../../RepetitiveEventForm/hooks/repetitiveFieldTools';
import {InteractionTimeFormProps} from './InteractionTimeForm';

const useInteractionTimeForm = (
    occurrenceIndex: InteractionTimeFormProps['occurrenceIndex'],
    interactionDate: InteractionTimeFormProps['interactionDate']
) => {
    const {generateFieldName} = repetitiveFieldTools(occurrenceIndex);
    const {watch, clearErrors, setValue, setError} = useFormContext();

    const startTime = watch(generateFieldName(InteractionEventDialogFields.START_TIME));

    const isEndTimeValid = (fieldName: string, currentTime: Date) => {
        if (fieldName === InteractionEventDialogFields.END_TIME) {
            return startTime && currentTime.getTime() > startTime.getTime()
        }
        return true;
    };

    const handleTimeChange = (currentTime: Date, fieldName: string) => {
        const formFieldName = generateFieldName(fieldName);
        if (isValid(currentTime)) {
            let newDate = new Date(interactionDate);
            newDate.setHours(currentTime.getHours());
            newDate.setMinutes(currentTime.getMinutes());

            if (isEndTimeValid(fieldName, newDate)) {
                if (newDate.getTime()) {
                    clearErrors(formFieldName);
                    setValue(formFieldName, newDate);
                }
            } else {
                setError(formFieldName, {type: 'manual', message: 'שעת סיום לא תקינה'});
            }
        } else {
            setError(formFieldName, {type: 'manual', message: 'שעה לא תקינה'});
        }
    };

    return {
        handleTimeChange
    }
};

export default useInteractionTimeForm;