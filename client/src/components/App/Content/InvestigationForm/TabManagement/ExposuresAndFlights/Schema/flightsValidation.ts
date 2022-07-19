import * as yup from 'yup';
import { isValid } from 'date-fns';
 
import { subDays, addDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import { invalidDateText, requiredText } from 'commons/Schema/messages';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר מאוחר מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';
const EndDateBeforeStartDateText = 'זמן הנחיתה  צריך להיות לאחר זמן ההמראה';

const flightValidation = (validationDate: Date): yup.Schema<any, object> => {
    
    const twoWeeksBeforeValidationDate = subDays(new Date(validationDate), 14);
    const includeValidationDate = addDays(new Date(validationDate), 1);

    return yup.object().shape({
        [fieldsNames.airline]: yup.object().nullable().required(requiredText),
        [fieldsNames.destinationAirport]: yup
            .string()
            .nullable()
            .required(requiredText),
        [fieldsNames.destinationCountry]: yup.string().nullable().required(requiredText),
        [fieldsNames.originAirport]: yup.string().nullable().required(requiredText),
        [fieldsNames.originCountry]: yup.string().nullable().required(requiredText),
        [fieldsNames.flightStartDate]: yup.date().nullable().required(requiredText)
            .typeError(invalidDateText)
            .max(includeValidationDate, endDateBeforeValidationDateText)
            .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText),
        [fieldsNames.flightEndDate]: yup.date().when(fieldsNames.flightStartDate, (flightStartDate: Date) => {
            return new Date(twoWeeksBeforeValidationDate) > flightStartDate 
                ? yup.date().required(requiredText)
                    .typeError(invalidDateText)
                    .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText)
                    .test('isDateValid', invalidDateText, (flightEndDate: any) => isValid(flightEndDate))
                : yup.date().required(requiredText)
                    .typeError(invalidDateText)
                    .max(includeValidationDate, endDateBeforeValidationDateText)
                    .test('isDateValid', invalidDateText, (flightEndDate: any) => isValid(flightEndDate))
                    .min((isValid(flightStartDate.setHours(0, 0, 0, 0)) ? flightStartDate : new Date(0)), EndDateBeforeStartDateText)
        }),
    });
};

export default flightValidation;