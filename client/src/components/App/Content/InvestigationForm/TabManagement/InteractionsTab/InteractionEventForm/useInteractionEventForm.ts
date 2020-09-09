import React from 'react';
import axios from 'Utils/axios';

import { useInteractionEventFormIncome, useInteractionEventFormOutcome } from './useInteractionEventFormInterfaces';

const useInteractionEventForm = (parameters: useInteractionEventFormIncome) : useInteractionEventFormOutcome => {

    const { setLocationsSubTypesByTypes } = parameters;

    // const isInIsolationToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setIsInIsolation(value));
    // const hasSymptomsToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasSymptoms(value));
    // const hasBackgroundIllnessesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasBackgroundDiseases(value));
    // const wasHospitalizedToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setWasHospitalized(value));

    const getLocationsSubTypesByTypes = () => {
        axios.get('/intersections/getLocationsSubTypesByTypes').then(
            result => 
            (result && result.data && result.data.data) &&
                setLocationsSubTypesByTypes((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
        );
    };

    // const getBackgroundDiseases = () => {
    //     axios.post('/clinicalDetails/backgroundDiseases').then(
    //         result => (result && result.data && result.data.data) &&
    //             setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName))
    //     );
    // };

    React.useEffect(() => {
        getLocationsSubTypesByTypes();
        // getBackgroundDiseases();
    }, []);

    return {

    }
    // return { 
    //     isInIsolationToggle,
    //     hasSymptomsToggle,
    //     hasBackgroundIllnessesToggle,
    //     wasHospitalizedToggle,
    // };
};

export default useInteractionEventForm;
