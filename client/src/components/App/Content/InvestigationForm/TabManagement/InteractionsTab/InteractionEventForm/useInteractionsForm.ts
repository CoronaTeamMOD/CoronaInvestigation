import { useSelector } from 'react-redux';
import * as yup from 'yup';
import Swal from 'sweetalert2';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import axios from 'Utils/axios';
import useDBParser from "Utils/vendor/useDBParsing";
import StoreStateType from 'redux/storeStateType';

import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from '../InteractionsEventDialogContext/InteractionEventContactFields';

const phoneNumberMatchValidation = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))|^$/;

const useInteractionsForm = (props : useInteractionFormIncome): useInteractionFormOutcome => {  
  const { interactionId, loadInteractions, closeNewDialog, closeEditDialog } = props;    
  const { parseLocation } = useDBParser();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const schema = yup.object().shape({
        [InteractionEventDialogFields.PLACE_TYPE]: yup.string().nullable().required('סוג אתר חובה'),
        [InteractionEventDialogFields.PLACE_SUB_TYPE]: yup.number().when(
          InteractionEventDialogFields.PLACE_TYPE, {
            is: placeType => placeType !== placeTypesCodesHierarchy.geriatric.code &&
                             placeType !== placeTypesCodesHierarchy.office.code,
            then: yup.number().required('תת סוג אתר חובה'),
            otherwise: yup.number().nullable()
          }
        ),
        [InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER]: yup.string().nullable()
          .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
        [InteractionEventDialogFields.START_TIME]: yup.date().required()
          .max(yup.ref(InteractionEventDialogFields.END_TIME), 'שעה מ לא יכולה להיות גדולה משעה עד'),
        [InteractionEventDialogFields.END_TIME]: yup.date().required()
          .min(yup.ref(InteractionEventDialogFields.START_TIME), 
          'שעה עד לא יכולה להיות קטנה משעה מ'),
        [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: yup.boolean().required('שדה חובה'),
        [InteractionEventDialogFields.CONTACTS]: yup.array().of(yup.object().shape({
            [InteractionEventContactFields.FIRST_NAME]: yup.string().nullable().required('שם פרטי חובה'),
            [InteractionEventContactFields.LAST_NAME]: yup.string().nullable().required('שם משפחה חובה'),
            [InteractionEventContactFields.PHONE_NUMBER]: yup.string().nullable().required('מספר טלפון חובה')
              .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
              [InteractionEventContactFields.ID]: yup.string().nullable()
                .matches(/^\d+|^$/, 'ת.ז חייבת להכיל מספרים בלבד')
                .length(9, 'ת.ז מכילה 9 מספרים בלבד')
                .test('isValid', "ת.ז לא תקינה", (id: string | null | undefined) => {
                  let sum = 0;
                  if (id?.length === 9) {
                    for (let i = 0; i < 9; i++) {
                      let digitMul = parseInt(id[i]) * ((i % 2) + 1);
                      if (digitMul > 9) {
                        digitMul -= 9;
                      }
                      sum += digitMul;
                    }
                  }
                  return sum % 10 === 0;
              })
          })),
        });

    const saveIntreactions = async (interactionsDataToSave: InteractionEventDialogData) => {
      const locationAddress = interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS] ? 
            await parseLocation(interactionsDataToSave[InteractionEventDialogFields.LOCATION_ADDRESS]) : null;

      if (interactionId) {
        axios.post('/intersections/updateContactEvent', {
          ...interactionsDataToSave,
          locationAddress,
          id: interactionId,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber
        })
          .then(() => {
            loadInteractions();
            closeEditDialog();
          }).catch(() => {
            handleFailedSave('לא ניתן היה לשמור את השינויים');
          })
      } else {
        axios.post('/intersections/createContactEvent', {
          ...interactionsDataToSave,
          locationAddress,
          [InteractionEventDialogFields.INVESTIGATION_ID]: epidemiologyNumber
        })
          .then((response) => {
            loadInteractions()
            closeNewDialog();
          })
          .catch((error) => {
              console.log(error);
              closeNewDialog();
              handleFailedSave('לא ניתן היה ליצור אירוע חדש');
          })
        }
    }

    const handleFailedSave = (message: string) => {
      Swal.fire({
        title: message,
        icon: 'error',
      })
    }

    return {
        schema,
        saveIntreactions
    }
};

interface useInteractionFormIncome {
  interactionId?: number;
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
}

interface useInteractionFormOutcome {
  schema: yup.ObjectSchema<object | undefined, object> | yup.Lazy;
  saveIntreactions: (interactionsData: InteractionEventDialogData) => void;
}

export default useInteractionsForm; 