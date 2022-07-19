import * as yup from 'yup';

import { requiredText , invalidDateText, invalidTimeText } from 'commons/Schema/messages';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import flightValidation from './flightsValidation';
import exposureValidation from './exposureValidation';
import borderCheckpointValidation from './borderCheckpointValidation';
import BorderCheckpointData from 'models/BorderCheckpointData';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';
import { subDays, addDays } from 'date-fns';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר מאוחר מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';


const hasExposureSource = (exposure: Exposure) => {
   // return exposure?.exposureSource !== undefined
};

const flightsAndExposures = (validationDate: Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
          //  if (hasExposureSource(exposure)) {
           //     return exposureValidation(validationDate);
          //  } else {
                return flightValidation(validationDate);
         //   }
        }
    );
};

const flights = (validationDate: Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
           // if (hasExposureSource(exposure)) {
             //   return yup.object();
           // } else {
                return flightValidation(validationDate);
           // }
        }
    );
};

const exposures = (validationDate: Date) => {
    return yup.lazy(
        (exposure: Exposure): yup.Schema<any, object> => {
         //   if (hasExposureSource(exposure)) {
               // return exposureValidation(validationDate);
           // } else {
                return yup.object();
           // }
        }
    );
};

const ExposureSchema = (validationDate: Date) => {

    const twoWeeksBeforeValidationDate = subDays(new Date(validationDate), 14);
    const includeValidationDate = addDays(new Date(validationDate), 1);

    return yup.object().shape({
        [fieldsNames.wasInVacation]: yup.boolean().nullable().required(requiredText),
        [fieldsNames.wasInEvent]: yup.boolean().nullable().required(requiredText),
        [fieldsNames.wasAbroad]: yup.boolean().required(),
        [fieldsNames.wasConfirmedExposure]: yup.boolean().required(),
        [fieldsNames.flights]: yup.array().when(
            fieldsNames.wasAbroad, {
                is: true,
                then: yup.array().of(flightValidation(validationDate)),
            }),
    
        // [fieldsNames.exposures]: yup.array().when(
        //     ['wasAboard', 'wereConfirmedExposures', 'borderCheckpointData'], (wasAboard: boolean, wereConfirmedExposures: boolean, borderCheckpointData?: BorderCheckpointData) => {
        //         return wasAboard && borderCheckpointData && borderCheckpointData?.borderCheckpointType == BorderCheckpointTypeCodes.FLIGHT && wereConfirmedExposures
        //             ? yup.array().of(flightsAndExposures(validationDate))
        //             : wasAboard && borderCheckpointData && borderCheckpointData?.borderCheckpointType == BorderCheckpointTypeCodes.FLIGHT
        //                 ? yup.array().of(flights(validationDate))
        //                 : wereConfirmedExposures
        //                     ? yup.array().of(exposures(validationDate))
        //                     : yup.array().of(yup.object());
        //     }
        // ),
        [fieldsNames.borderCheckpointType]: yup.number().nullable().when(
            fieldsNames.wasAbroad,
            {
                is: true,
                then: yup.number().nullable().required(requiredText),
            }),
            [fieldsNames.borderCheckpoint]: yup.string().nullable().when(
                fieldsNames.wasAbroad,
                {
                    is: true,
                    then: yup.string().nullable().required(requiredText),
                }),
            [fieldsNames.arrivalDateToIsrael]: yup.date().when(
                    [fieldsNames.wasAbroad, fieldsNames.borderCheckpointType],
                    (wasAbroad: boolean, borderCheckpointType: number) => {
                        return wasAbroad == true && borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT ?
                            yup.date().nullable().required(requiredText)
                                .typeError(invalidDateText)
                                .max(includeValidationDate, endDateBeforeValidationDateText)
                                .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText)
                            : yup.object().nullable();
                    }
                ),
                [fieldsNames.arrivalTimeToIsrael]: yup.date().when(
                    [fieldsNames.wasAbroad, fieldsNames.borderCheckpointType],
                    (wasAbroad: boolean, borderCheckpointType: number) => {
                        return wasAbroad==true && borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT ?
                            yup.date().nullable().required(requiredText).typeError(invalidTimeText)
                            : yup.object().nullable();
                    }
                ),
        });



};

export default ExposureSchema;