import * as yup from 'yup';

import { subDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר גדול מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';
const requiredErrorMessage = 'שדה חובה';
const EndDateBeforeStartDateText = 'תאריך טיסת חזור צריך להיות מאוחר יותר מתאריך טיסת הלוך';

const flightValidation = (validationDate: Date): yup.Schema<any, object> => {
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
            .max(validationDate, endDateBeforeValidationDateText)
            .min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText),
        [fieldsNames.flightEndDate]: yup.date().when([fieldsNames.flightEndDate], {
            is: true,
            then: yup.date().when(fieldsNames.flightEndDate, (flightEndDate: Date) => {
                return new Date(subDays(new Date(validationDate), 14)) > flightEndDate ?
                yup.date().min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText).required(requiredErrorMessage) :
                yup.date().min(yup.ref(fieldsNames.flightStartDate), EndDateBeforeStartDateText).max(validationDate, endDateBeforeValidationDateText)
            }),
            otherwise: yup.date().nullable()
        })        
    });
};

export default flightValidation;
