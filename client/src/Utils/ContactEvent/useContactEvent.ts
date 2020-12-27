import placeTypesCodesHierarchy from './placeTypesCodesHierarchy';

const useContactEvent = () => {

    const isPatientHouse = (placeSubType: number | null) => placeSubType === placeTypesCodesHierarchy.privateHouse.subTypesCodes?.patientHouse.code

    return {
        isPatientHouse,
    }
};

export default useContactEvent;