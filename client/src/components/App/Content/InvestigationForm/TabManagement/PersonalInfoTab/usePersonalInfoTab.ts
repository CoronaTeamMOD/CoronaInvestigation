import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const {setOccupations, setInsuranceCompanies, setPersonalInfoData, 
        setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/occupations').then((res: any) => occupationsStateContext.occupations = res?.data?.data?.allOccupations?.nodes?.map((node: any) => node.displayName));
        axios.get('/personalDetails/hmos').then((res: any) => res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data.data && res.data.data.investigationByEpidemiologyNumber) {
                const investigatedPatient = res.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                setInvestigatedPatientId(investigatedPatient.id);
                const patientAddress = investigatedPatient.addressByAddress;
                setPersonalInfoData({
                    phoneNumber: investigatedPatient.personByPersonId.phoneNumber,
                    additionalPhoneNumber:  investigatedPatient.personByPersonId.additionalPhoneNumber,
                    contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
                    insuranceCompany: investigatedPatient.hmo,
                    city : investigatedPatient.addressByAddress.city,
                    street : investigatedPatient.addressByAddress.street,
                    floor : investigatedPatient.addressByAddress.floor,
                    houseNum : investigatedPatient.addressByAddress.houseNum,
                    relevantOccupation: investigatedPatient.occupation,
                    educationOccupationCity: 
                    (investigatedPatient.occupation === Occupations.EDUCATION_SYSTEM && investigatedPatient.subOccupationBySubOccupation)
                    ?
                    investigatedPatient.subOccupationBySubOccupation.city : '',
                    institutionName: investigatedPatient.subOccupation,
                    otherOccupationExtraInfo: investigatedPatient.otherOccupationExtraInfo,
                    contactInfo: investigatedPatient.patientContactInfo
                });
                investigatedPatient.subOccupationBySubOccupation && setSubOccupationName(investigatedPatient.subOccupationBySubOccupation.displayName);
                if (patientAddress.cityByCity !== null) {
                    setCityName(investigatedPatient.addressByAddress.cityByCity.displayName);    
                }
                if (patientAddress.streetByStreet !== null) {
                    setStreetName(investigatedPatient.addressByAddress.streetByStreet.displayName);
                }
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
