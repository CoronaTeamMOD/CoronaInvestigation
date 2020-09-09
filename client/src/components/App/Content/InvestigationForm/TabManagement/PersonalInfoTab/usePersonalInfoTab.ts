import axios from 'Utils/axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import { PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 
import PersonalInfoTab from './PersonalInfoTab';

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, string>(state => state.investigation.epidemiologyNumber);

    const {occupations, setOccupations, insuranceCompanies, setInsuranceCompanies, personalInfoStateContext} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/getAllOccupations').then((res: any) => setOccupations(res.data.data.allOccupations.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getAllHmos').then((res: any) => setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getInvestigatedPatientFieldsIds?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {})
    }

    return {
        fetchPersonalInfo
    }
}

export default usePersonalInfoTab;