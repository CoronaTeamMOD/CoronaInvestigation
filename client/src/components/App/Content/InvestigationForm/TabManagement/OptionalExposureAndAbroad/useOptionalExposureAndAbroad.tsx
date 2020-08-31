import {useOptionalExposureAndAbroadIncome, useOptionalExposureAndAbroadOutcome} from './useOptionalExposureAndAbroadInterface';

const useOptionalExposureAndAbroad = (params: useOptionalExposureAndAbroadIncome): useOptionalExposureAndAbroadOutcome => {
    const {setWasExposedToVerifiedPatient} = params;

    const wasExposedToVerifiedPatientToggle = (event: React.ChangeEvent<{}>, value:boolean): void =>
    (setWasExposedToVerifiedPatient(value));

    return {
        wasExposedToVerifiedPatientToggle
    };
};

export default useOptionalExposureAndAbroad;