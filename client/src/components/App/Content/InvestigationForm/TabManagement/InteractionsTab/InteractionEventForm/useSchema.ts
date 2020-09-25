import * as yup from "yup";

import placeTypesCodesHierarchy from "Utils/placeTypesCodesHierarchy";

import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from '../InteractionsEventDialogContext/InteractionEventContactFields';

const useSchema = () => {        

    const schema = yup.object().shape({
        [InteractionEventDialogFields.INVESTIGATION_ID]: yup.number().required(),
        [InteractionEventDialogFields.ID]: yup.number().required(),
        [InteractionEventDialogFields.PLACE_TYPE]: yup.string().required(),
        [InteractionEventDialogFields.PLACE_SUB_TYPE]: yup.number().when(
          InteractionEventDialogFields.PLACE_TYPE, {
            is: placeType => placeType !== placeTypesCodesHierarchy.geriatric.code ||
                             placeType !== placeTypesCodesHierarchy.office.code,
            then: yup.number().required(),
            otherwise: yup.number().nullable()
          }
        ),
        [InteractionEventDialogFields.PLACE_NAME]: yup.string().when(
          InteractionEventDialogFields.PLACE_TYPE, {
            is: placeTypeCode => placeTypeCode !== placeTypesCodesHierarchy.privateHouse.code || 
                                 placeTypeCode !== placeTypesCodesHierarchy.transportation.code,
            then: yup.string().required,
            otherwise: yup.string().nullable()            
          }
        ),
        [InteractionEventDialogFields.LOCATION_ADDRESS]: yup.string().when(
          InteractionEventDialogFields.PLACE_TYPE, {
            is: placeType => placeType !== placeTypesCodesHierarchy.transportation.code,
            then: yup.string().required(),
            otherwise: yup.string().nullable()
          }
        ),
        [InteractionEventDialogFields.GRADE]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeSubType => placeSubType === placeTypesCodesHierarchy.school.subTypesCodes.elementarySchool ||
                                placeSubType === placeTypesCodesHierarchy.school.subTypesCodes.highSchool,
            then: yup.string().required(),
            otherwise: yup.string().required()
          }
        ),
        [InteractionEventDialogFields.HOSPITAL_DEPARTMENT]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.medical.subTypesCodes.hospital,
            then: yup.string().required(),
            otherwise: yup.string().nullable()
          }
        ),
        [InteractionEventDialogFields.BUS_LINE]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable()
          }
        ),
        [InteractionEventDialogFields.BUS_COMPANY]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.CITY_ORIGIN]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.BOARDING_STATION]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.CITY_DESTINATION]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.END_STATION]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.bus,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_NUM]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.AIR_LINE]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_ORIGIN_CITY]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_ORIGIN_AIRPORT]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_DESTINATION_CITY]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.FLIGHT_DESTINATION_AIRPORT]: yup.string().when(
          InteractionEventDialogFields.PLACE_SUB_TYPE, {
            is: placeTypesCodesHierarchy.transportation.subTypesCodes.flight,
            then: yup.string().required(),
            otherwise: yup.string().nullable() 
          }
        ),
        [InteractionEventDialogFields.START_TIME]: yup.date().required(),
        [InteractionEventDialogFields.END_TIME]: yup.date().required(),
        [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: yup.boolean().required(),
        [InteractionEventDialogFields.CONTACTS]: yup.array().of(yup.object().shape({
            [InteractionEventContactFields.FIRST_NAME]: yup.string().required(),
            [InteractionEventContactFields.LAST_NAME]: yup.string().required(),
            [InteractionEventContactFields.PHONE_NUMBER]: yup.string().required(),
            [InteractionEventContactFields.ID]: yup.string().required(),
            [InteractionEventContactFields.CONTACT_TYPE]: yup.string().required(),
            [InteractionEventContactFields.EXTRA_INFO]: yup.string().required()
        })),
        // [InteractionEventDialogFields.CONTACT_PERSON_FIRST_NAME]: yup.string().when(
        //   [InteractionEventDialogFields.PLACE_TYPE, InteractionEventDialogFields.PLACE_SUB_TYPE], {
        //     is: (placeType, placeSubType) => {
        //       switch(placeType) {
        //         case placeTypesCodesHierarchy.religion.code: {
        //           return true;
        //         }
        //         case placeTypesCodesHierarchy.privateHouse.code: {
        //           return false;
        //         }
        //         case placeTypesCodesHierarchy.geriatric.code: {
        //           return true;
        //         }
        //         case placeTypesCodesHierarchy.school.code: {
        //           return true;
        //         }
        //         case placeTypesCodesHierarchy.medical.code: {
        //           return true;
        //         }
        //         case placeTypesCodesHierarchy.otherPublicPlaces.code: {
      
        //         }
        //       }
        //       if (value === placeTypesCodesHierarchy.transportation.code)
        //     },
        //     then: yup.string().required(),
        //     otherwise: yup.string().nullable()
        //   }
        // ),
        // [InteractionEventDialogFields.CONTACT_PERSON_LAST_NAME]: yup.string().required(),
        // [InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER]: yup.string().required(),
      });
      
    return {
        schema
    }
};

export default useSchema;