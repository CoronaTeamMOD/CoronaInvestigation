import * as yup from 'yup';

import { subDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const hebrewAndEnglish = /^[a-zA-Z\u0590-\u05fe\s]*$/;
const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר גדול מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';

const flightValidation = (validationDate: Date): yup.Schema<any, object> => {
    return yup.object().shape({
        [fieldsNames.airline]: yup.string().nullable(),
        [fieldsNames.destinationAirport]: yup
            .string()
            .nullable()
            .matches(hebrewAndEnglish, 'תווים בעברית ובאנגלית בלבד')
            .required('שדה חובה'),
        [fieldsNames.destinationCity]: yup.string().nullable().matches(hebrewAndEnglish, 'תווים בעברית ובאנגלית בלבד').required('שדה חובה'),
        [fieldsNames.destinationCountry]: yup.string().nullable().required('שדה חובה'),
        [fieldsNames.flightNumber]: yup.string().nullable(),
        [fieldsNames.originAirport]: yup.string().nullable().matches(hebrewAndEnglish, 'תווים בעברית ובאנגלית בלבד').required('שדה חובה'),
        [fieldsNames.originCity]: yup.string().nullable().matches(hebrewAndEnglish, 'תווים בעברית ובאנגלית בלבד').required('שדה חובה'),
        [fieldsNames.originCountry]: yup.string().nullable().required('שדה חובה'),
        [fieldsNames.flightEndDate]: yup
            .date()
            .nullable()
            .required('שדה חובה')
            .max(validationDate, endDateBeforeValidationDateText)
            .min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText),
        [fieldsNames.flightStartDate]: yup
            .date()
            .nullable()
            .required('שדה חובה')
            .max(validationDate, endDateBeforeValidationDateText)
            .min(subDays(new Date(validationDate), 14), twoWeeksBeforeValidationDateText),
    });
};

export default flightValidation;
