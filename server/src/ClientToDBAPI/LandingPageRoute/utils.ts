import { differenceInYears } from 'date-fns';

// All the different interfaces and functions are there for decoupling the user and the group investigations

interface UserInvestigations {
    orderedInvestigations: {
        nodes: [{
            comment: string;
            epidemiologyNumber: number;
            coronaTestDate: Date;
            complexityCode: number;
            priority: number;
            statusReason: string;
            transferReason: string;
            wasInvestigationTransferred: boolean;
            deskByDeskId: {
                deskName: string;
            } | null;
            investigatedPatientByInvestigatedPatientId: {
                covidPatientByCovidPatient: {
                    birthDate: Date;
                    fullName: string;
                    primaryPhone: string;
                    addressByAddress: {
                        cityByCity: {
                            displayName: string;
                        } | null
                    } | null
                }
            };
            investigationStatusByInvestigationStatus: {
                displayName: string;
            }
            investigationSubStatusByInvestigationSubStatus: {
                displayName: string;
            } | null;
            userByCreator: {
                id: string;
                userName: string;
            };
        }]
    }
}

interface GroupIvestigations {
    orderedInvestigations: {
        nodes: [{
            comment: string;
            epidemiologyNumber: number;
            coronaTestDate: Date;
            complexityCode: number;
            priority: number;
            statusReason: string;
            transferReason: string;
            wasInvestigationTransferred: boolean;
            deskByDeskId: {
                deskName: string;
            } | null;
            investigatedPatientByInvestigatedPatientId: {
                covidPatientByCovidPatient: {
                    birthDate: Date;
                    fullName: string;
                    primaryPhone: string;
                    addressByAddress: {
                        cityByCity: {
                            displayName: string;
                        } | null
                    } | null
                }
            };
            investigationStatusByInvestigationStatus: {
                displayName: string;
            }
            investigationSubStatusByInvestigationSubStatus: {
                displayName: string;
            } | null;
            userByCreator: {
                id: string;
                userName: string;
                countyByInvestigationGroup: {
                    districtByDistrictId: {
                        displayName: string;
                    }
                    displayName: string;
                }
            };
        }]
    }
}

const mappingUserInvestigations = (investigation: UserInvestigations['orderedInvestigations']['nodes'][number]) => {
    const newObject = {
        ...investigation,
        isComplex: investigation.complexityCode !== 2,
        investigatedPatientByInvestigatedPatientId: {
            ...investigation.investigatedPatientByInvestigatedPatientId,
            covidPatientByCovidPatient: {
                ...investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient,
                age: differenceInYears(new Date(), new Date(investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate))
            }
        },
        desk: investigation.deskByDeskId?.deskName
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;

    return newObject;
}

const mappingGroupInvestigations = (investigation: GroupIvestigations['orderedInvestigations']['nodes'][number]) => {
    const newObject = {
        ...investigation,
        isComplex: investigation.complexityCode !== 2,
        investigatedPatientByInvestigatedPatientId: {
            ...investigation.investigatedPatientByInvestigatedPatientId,
            covidPatientByCovidPatient: {
                ...investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient,
                age: differenceInYears(new Date(), new Date(investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate))
            }
        },
        userByCreator: {
            ...investigation.userByCreator,
            countyByInvestigationGroup: {
                ...investigation.userByCreator.countyByInvestigationGroup,
                displayName: investigation.userByCreator.countyByInvestigationGroup.displayName + 
                             '-' + 
                             investigation.userByCreator.countyByInvestigationGroup.districtByDistrictId.displayName
            }
        },
        desk: investigation.deskByDeskId?.deskName
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;
    delete newObject.userByCreator.countyByInvestigationGroup.districtByDistrictId;

    return newObject;
}

export const convertUserInvestigationsData = (dbData: UserInvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingUserInvestigations);
}

export const convertGroupInvestigationsData = (dbData: GroupIvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingGroupInvestigations);
}