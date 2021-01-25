import * as yup from 'yup';

import { subDays, addDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר גדול מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';
const requiredErrorMessage = 'שדה חובה';
const EndDateBeforeStartDateText = 'זמן הנחיתה  צריך להיות לאחר זמן ההמראה';


const flightValidation = (validationDate: Date): yup.Schema<any, object> => {
    const twoWeeksBeforeValidationDate = subDays(new Date(validationDate), 14);
    const includeValidationDate = addDays(new Date(validationDate), 1);

    return yup.object().shape({
        [fieldsNames.airline]: yup.string().nullable(),
        [fieldsNames.destinationAirport]: yup
            .string()
            .nullable()
            .required(requiredErrorMessage),
        [fieldsNames.destinationCity]: yup.string().nullable(),
        [fieldsNames.destinationCountry]: yup.string().nullable().required(requiredErrorMessage),
        [fieldsNames.flightNumber]: yup.string().nullable().required(requiredErrorMessage),
        [fieldsNames.originAirport]: yup.string().nullable().required(requiredErrorMessage),
        [fieldsNames.originCity]: yup.string().nullable(),
        [fieldsNames.originCountry]: yup.string().nullable().required(requiredErrorMessage),
        [fieldsNames.flightStartDate]: yup
            .date()
            .nullable()
            .required(requiredErrorMessage)
            .max(includeValidationDate, endDateBeforeValidationDateText)
            .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText),
        [fieldsNames.flightEndDate]: yup.date().when(fieldsNames.flightStartDate, (flightStartDate: Date) => {
            return new Date(twoWeeksBeforeValidationDate) > flightStartDate ?
            yup.date().min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText).required(requiredErrorMessage) :
            yup.date().min(flightStartDate, EndDateBeforeStartDateText).max(includeValidationDate, endDateBeforeValidationDateText).required(requiredErrorMessage)
        }),
    });
};

export default flightValidation;
