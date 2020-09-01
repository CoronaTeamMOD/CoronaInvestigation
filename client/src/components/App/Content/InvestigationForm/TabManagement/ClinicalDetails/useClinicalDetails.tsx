import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const { setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses } = parameters;

    const isInIsolationToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setIsInIsolation(value));
    const hasSymptomsToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasSymptoms(value));
    const hasBackgroundIllnessesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasBackgroundIllnesses(value));

    return { 
        isInIsolationToggle,
        hasSymptomsToggle,
        hasBackgroundIllnessesToggle,
    };
};

export default useClinicalDetails;
