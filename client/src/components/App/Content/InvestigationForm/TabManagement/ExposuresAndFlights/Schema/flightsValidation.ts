import * as yup from 'yup';

import { subDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר גדול מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';
const requiredErrorMessage = 'שדה חובה';

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
        [fieldsNames.flightEndDate]: yup
            .date()
            .nullable()
            .required(requiredErrorMessage)
            .max(validationDate, endDateBeforeValidationDateText)
            .min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText),
        [fieldsNames.flightStartDate]: yup
            .date()
            .nullable()
            .required(requiredErrorMessage)
            .max(validationDate, endDateBeforeValidationDateText)
            .min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText),
    });
};

export default flightValidation;
