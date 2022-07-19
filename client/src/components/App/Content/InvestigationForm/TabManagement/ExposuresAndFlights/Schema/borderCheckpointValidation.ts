import * as yup from 'yup';

import { subDays, addDays } from 'date-fns';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import { invalidDateText, requiredText, invalidTimeText } from 'commons/Schema/messages';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר מאוחר מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';

const borderCheckpointValidation = (validationDate: Date): yup.Schema<any, object> => {

    const twoWeeksBeforeValidationDate = subDays(new Date(validationDate), 14);
    const includeValidationDate = addDays(new Date(validationDate), 1);

    return yup.object().when(
        fieldsNames.wereFlights,
        {
            is: true,
            then: yup.object().shape({
                [fieldsNames.borderCheckpoint]: yup.object().nullable().required(requiredText),
                [fieldsNames.lastDestinationCountry]: yup.string().nullable().required(requiredText),
                [fieldsNames.borderCheckpointType]: yup
                    .number()
                    .nullable()
                    .required(requiredText),
                [fieldsNames.arrivalDateToIsrael]: yup.date().when(
                    [fieldsNames.borderCheckpointType],
                    (borderCheckpointType: number) => {
                        return borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT ?
                            yup.date().nullable().required(requiredText)
                                .typeError(invalidDateText)
                                .max(includeValidationDate, endDateBeforeValidationDateText)
                                .min(twoWeeksBeforeValidationDate, twoWeeksBeforeValidationDateText)
                            : yup.object().nullable();
                    }
                ),
                [fieldsNames.arrivalTimeToIsrael]: yup.date().when(
                    [fieldsNames.borderCheckpointType],
                    (borderCheckpointType: number) => {
                        return borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT ?
                            yup.date().nullable().required(requiredText).typeError(invalidTimeText)
                            : yup.object().nullable();
                    }
                ),

            }),
            else: yup.object().nullable(),
        });
};

export default borderCheckpointValidation;