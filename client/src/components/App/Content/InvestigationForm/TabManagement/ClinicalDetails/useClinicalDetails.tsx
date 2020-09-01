import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const { setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses, setHasTroubleIsolating, setWasHospitalized } = parameters;

    const isInIsolationToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setIsInIsolation(value));
    const hasSymptomsToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasSymptoms(value));
    const hasBackgroundIllnessesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasBackgroundIllnesses(value));
    const hasTroubleIsolatingToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasTroubleIsolating(value));
    const wasHospitalizedToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setWasHospitalized(value));

    return { 
        isInIsolationToggle,
        hasSymptomsToggle,
        hasBackgroundIllnessesToggle,
        hasTroubleIsolatingToggle,
        wasHospitalizedToggle,
    };
};

export default useClinicalDetails;
