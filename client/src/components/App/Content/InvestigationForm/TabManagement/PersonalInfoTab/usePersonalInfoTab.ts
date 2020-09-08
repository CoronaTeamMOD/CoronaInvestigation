import axios from 'Utils/axios';

import { PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 
import PersonalInfoTab from './PersonalInfoTab';

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const {occupations, setOccupations, insuranceCompanies, setInsuranceCompanies} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/getAllOccupations').then(res => setOccupations(res.data.data.allOccupations.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getAllHmos').then(res => setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
    }

    return {
        fetchPersonalInfo
    }
}

export default usePersonalInfoTab;