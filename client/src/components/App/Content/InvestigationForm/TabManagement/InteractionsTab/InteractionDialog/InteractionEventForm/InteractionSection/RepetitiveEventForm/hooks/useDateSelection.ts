import {isSameDay} from 'date-fns';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {OccuranceData} from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const initialOccuranceData = (startDate: Date): OccuranceData =>  ({
    startTime: startDate,
    endTime: startDate,
    placeDescription: '',
    unknownTime: false,
    externalizationApproval: null
});

const useDateSelection = () => {
    const {control} = useFormContext();
    const { fields: selectedDates, append, remove } = useFieldArray<OccuranceData>({ control, name: InteractionEventDialogFields.ADDITIONAL_OCCURRENCES });

    const onDateCheckClick = (date: Date, isChecked: boolean) => {
        if (isChecked) {
            append(initialOccuranceData(date))
        } else {
            const index = getDateIndex(date);
            index >= 0 && remove(index);
        }
    };

    const isDateSelected = (date: Date) => selectedDates.some(selctedOccurence => isSameDay(selctedOccurence.startTime as Date, date));
    const getDateIndex = (date: Date) => selectedDates.findIndex(selctedOccurence => isSameDay(selctedOccurence.startTime as Date, date));

    return {
        onDateCheckClick,
        isDateSelected,
        selectedDates,
        getDateIndex
    }
};

export default useDateSelection;