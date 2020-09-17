import axios from 'Utils/axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 
import SubOccupationsSelectOccupations from 'models/enums/SubOccupationsSelectOccupations';

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const {setOccupations, setInsuranceCompanies, personalInfoStateContext, 
        setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/occupations').then((res: any) => res && res.data && res.data.data && setOccupations(res.data.data.allOccupations.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/hmos').then((res: any) => res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data.data && res.data.data.investigationByEpidemiologyNumber) {
                let investigatedPatient = res.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                setInvestigatedPatientId(investigatedPatient.id);
                personalInfoStateContext.setPersonalInfoData({
                    phoneNumber: {...personalInfoStateContext.personalInfoData.phoneNumber, number: investigatedPatient.personByPersonId.phoneNumber},
                    additionalPhoneNumber: {...personalInfoStateContext.personalInfoData.additionalPhoneNumber, number: investigatedPatient.personByPersonId.additionalPhoneNumber},
                    contactPhoneNumber: {...personalInfoStateContext.personalInfoData.contactPhoneNumber, number: investigatedPatient.patientContactPhoneNumber},
                    insuranceCompany: investigatedPatient.hmo,
                    address: {...investigatedPatient.addressByAddress},
                    relevantOccupation: investigatedPatient.occupation,
                    educationOccupationCity: (investigatedPatient.occupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM)
                    ?
                    investigatedPatient.subOccupationBySubOccupation.city : '',
                    institutionName: investigatedPatient.subOccupation,
                    otherOccupationExtraInfo: investigatedPatient.otherOccupationExtraInfo
                });
                investigatedPatient.subOccupationBySubOccupation && setSubOccupationName(investigatedPatient.subOccupationBySubOccupation.displayName);
                setCityName(investigatedPatient.addressByAddress.cityByCity.displayName);
                setStreetName(investigatedPatient.addressByAddress.streetByStreet.displayName);
            }
        })
    }

    const getSubOccupations = (parentOccupation: string) => {
        axios.get('/personalDetails/subOccupations?parentOccupation=' + parentOccupation).then((res: any) => {
            setSubOccupations(res && res.data && res.data.data && res.data.data.allSubOccupations.nodes.map((node: any) => {
                return {
                    id: node.id, 
                    subOccupation: node.displayName
                }
            }));
        });
    }

    const getEducationSubOccupations = (city: string) => {
        axios.get('/personalDetails/educationSubOccupations?city=' + city).then((res: any) => {
            setSubOccupations(res && res.data && res.data.data && res.data.data.allSubOccupations.nodes.map((node: any) => { 
                return {
                    id: node.id, 
                    subOccupation: node.displayName, 
                    street: node.street
                }
            }));
        });
    }

    const getStreetsByCity = (cityId: string) => {
        axios.get('/addressDetails/city/' + cityId + '/streets').then((res: any) => {
            setStreets(res && res.data && res.data.map((node: any) => (
                {
                    displayName: node.displayName,
                    id: node.id
                }
            )));
        });
    }

    return {
        fetchPersonalInfo,
        getSubOccupations,
        getEducationSubOccupations,
        getStreetsByCity
    }
}

export default usePersonalInfoTab;