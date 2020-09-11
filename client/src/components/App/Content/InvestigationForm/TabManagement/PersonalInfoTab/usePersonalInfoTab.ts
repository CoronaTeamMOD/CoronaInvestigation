import axios from 'Utils/axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const {occupations, setOccupations, insuranceCompanies, setInsuranceCompanies, personalInfoStateContext, 
        subOccupations, setSubOccupations, subOccupationName, setSubOccupationName, cityName, setCityName, streetName, setStreetName, setStreets} = parameters;

    const fetchPersonalInfo = () => {
        axios.get('/personalDetails/getAllOccupations').then((res: any) => res && res.data && res.data.data && setOccupations(res.data.data.allOccupations.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getAllHmos').then((res: any) => res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/getInvestigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data.data && res.data.data.investigationByEpidemiologyNumber) {
                let investigatedPatient = res.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                setInvestigatedPatientId(investigatedPatient.id);
                personalInfoStateContext.setPersonalInfoData({
                    phoneNumber: getUpdatedField(investigatedPatient.personByPersonId.phoneNumber, personalInfoStateContext.personalInfoData.phoneNumber),
                    additionalPhoneNumber: getUpdatedField(investigatedPatient.personByPersonId.additionalPhoneNumber, personalInfoStateContext.personalInfoData.additionalPhoneNumber),
                    contactPhoneNumber: getUpdatedField(investigatedPatient.patientContactPhoneNumber, personalInfoStateContext.personalInfoData.contactPhoneNumber),
                    insuranceCompany: getUpdatedField(investigatedPatient.hmo, personalInfoStateContext.personalInfoData.insuranceCompany),
                    address: 
                    {   
                        city: getUpdatedField(investigatedPatient.addressByAddress.city, personalInfoStateContext.personalInfoData.address.city),
                        street: getUpdatedField(investigatedPatient.addressByAddress.street, personalInfoStateContext.personalInfoData.address.street),
                        floor: getUpdatedField(investigatedPatient.addressByAddress.floor, personalInfoStateContext.personalInfoData.address.floor),
                        houseNum: getUpdatedField(investigatedPatient.addressByAddress.houseNum, personalInfoStateContext.personalInfoData.address.houseNum)
                    },
                    relevantOccupation: getUpdatedField(investigatedPatient.occupation, personalInfoStateContext.personalInfoData.relevantOccupation),
                    educationOccupationCity: investigatedPatient.occupation === 'משרד החינוך' ? getUpdatedField(investigatedPatient.subOccupationBySubOccupation.city, personalInfoStateContext.personalInfoData.educationOccupationCity): '',
                    institutionName: getUpdatedField(investigatedPatient.subOccupation, personalInfoStateContext.personalInfoData.institutionName),
                    otherOccupationExtraInfo: getUpdatedField(investigatedPatient.other_occupation_extra_info, personalInfoStateContext.personalInfoData.otherOccupationExtraInfo)
                });
                investigatedPatient.subOccupationBySubOccupation && setSubOccupationName(getUpdatedField(investigatedPatient.subOccupationBySubOccupation.displayName, ''));
                setCityName(getUpdatedField(investigatedPatient.addressByAddress.cityByCity.displayName, ''));
                setStreetName(getUpdatedField(investigatedPatient.addressByAddress.streetByStreet.displayName, ''));
            }
        })
    }

    const getSubOccupations = (parentOccupation: string) => {
        axios.get('/personalDetails/getSubOccupations?parentOccupation=' + parentOccupation).then((res: any) => {
            setSubOccupations(res && res.data && res.data.data && res.data.data.allSubOccupations.nodes.map((node: any) => {
                return {
                    id: node.id, 
                    subOccupation: node.displayName
                }
            }));
        });
    }

    const getEducationSubOccupations = (city: string) => {
        axios.get('/personalDetails/getEducationSubOccupations?city=' + city).then((res: any) => {
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
            setStreets(res && res.data && res.data.map((node: any) => {
                return {
                    displayName: node.displayName,
                    id: node.id
                }
            }));
        });
    }

    const getUpdatedField = (recievedField: any, currentField: any): any => {
        return (recievedField ? recievedField : currentField);
    }

    return {
        fetchPersonalInfo,
        getSubOccupations,
        getEducationSubOccupations,
        getStreetsByCity
    }
}

export default usePersonalInfoTab;