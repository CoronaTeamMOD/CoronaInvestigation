import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import { initDBAddress } from 'models/DBAddress';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import useStyles from './PersonalInfoTabStyles';
import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const classes = useStyles({});

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { setInsuranceCompanies, setPersonalInfoData, setSubOccupations, setSubOccupationName,
            setCityName, setStreetName, setStreets, occupationsStateContext, setInsuranceCompany
    } = parameters;

    const fetchPersonalInfo = (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                               trigger: (payload?: string | string[]) => Promise<boolean>
                              ) => {
        axios.get('/personalDetails/occupations').then((res: any) => occupationsStateContext.occupations = res?.data?.data?.allOccupations?.nodes?.map((node: any) => node.displayName));
        axios.get('/personalDetails/hmos').then((res: any) => res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName)));
        axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data) {
                const investigatedPatient = res.data;
                setInvestigatedPatientId(investigatedPatient.id);
                const patientAddress = investigatedPatient.addressByAddress;
                let convertedPatientAddress = null;
                if (patientAddress) {
                    let city = null;
                    let street = null;
                    if (patientAddress.cityByCity !== null) {
                        city = patientAddress.cityByCity.id;
                        setCityName(patientAddress.cityByCity.displayName);
                    }
                    if (patientAddress.streetByStreet !== null) {
                        street = patientAddress.streetByStreet.id;
                        setStreetName(patientAddress.streetByStreet.displayName);
                    }
                    convertedPatientAddress = {
                        city,
                        street,
                        floor: patientAddress.floor,
                        houseNum: patientAddress.houseNum,
                    }
                } else {
                    convertedPatientAddress = initDBAddress;
                }
                const PersonalInfoData = {
                    phoneNumber: investigatedPatient.primaryPhone,
                    additionalPhoneNumber:  investigatedPatient.additionalPhoneNumber,
                    contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
                    insuranceCompany: investigatedPatient.hmo,
                    ...convertedPatientAddress,
                    relevantOccupation: investigatedPatient.occupation,
                    educationOccupationCity: investigatedPatient.occupation === Occupations.EDUCATION_SYSTEM && investigatedPatient.subOccupationBySubOccupation ?
                        investigatedPatient.subOccupationBySubOccupation.city : '',
                    institutionName: investigatedPatient.subOccupation,
                    otherOccupationExtraInfo: investigatedPatient.otherOccupationExtraInfo,
                    contactInfo: investigatedPatient.patientContactInfo
                }
                setPersonalInfoData(PersonalInfoData);
                reset(PersonalInfoData);
                trigger();
                investigatedPatient.subOccupationBySubOccupation && setSubOccupationName(investigatedPatient.subOccupationBySubOccupation.displayName);
                if (investigatedPatient.hmo !== null) {
                    setInsuranceCompany(investigatedPatient.hmo);
                }
            }
        }).catch(() => {
            Swal.fire({
                title: 'הייתה שגיאה בטעינת הפרטים האישיים',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
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
