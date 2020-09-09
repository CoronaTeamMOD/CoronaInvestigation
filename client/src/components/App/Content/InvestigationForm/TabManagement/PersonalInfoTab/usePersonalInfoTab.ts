import axios from 'Utils/axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const {occupations, setOccupations, insuranceCompanies, setInsuranceCompanies, personalInfoStateContext} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/getAllOccupations').then((res: any) => res && res.data && res.data.data && setOccupations(res.data.data.allOccupations.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getAllHmos').then((res: any) => res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getInvestigatedPatientPersonalInfoFields?epidemioligyNumber=' + 122).then((res: any) => {
            console.log(res);
            let investigatedPatient = res.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
            personalInfoStateContext.setPersonalInfoData({
                phoneNumber: investigatedPatient.personByPersonId.phoneNumber,
                additionalPhoneNumber: investigatedPatient.personByPersonId.additionalPhoneNumber,
                contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
                insuranceCompany: investigatedPatient.hmo,
                address: {...investigatedPatient.addressByAddress},
                relevantOccupation: investigatedPatient.occupation,
                institutionName: investigatedPatient.subOccupation
            });
            // personalInfoStateContext.setPersonalInfoData({
            //     ...personalInfoStateContext.personalInfoData, phoneNumber: '3'
            // })
        })
    }

    return {
        fetchPersonalInfo
    }
}

export default usePersonalInfoTab;