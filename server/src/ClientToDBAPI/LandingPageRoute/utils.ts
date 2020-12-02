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
            investigationGroupByGroupId: {
                investigationGroupReasonByReason : {
                    displayName: string;
                }
                otherReason: string;
            } | null;
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
            investigationGroupByGroupId: {
                investigationGroupReasonByReason : {
                    displayName: string | null;
                }
                otherReason: string | null;
            } | null;
        }]
    }
}

interface GroupedIvestigations {
    allInvestigations: {
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
                    displayName: string;
                    districtByDistrictId: {
                        displayName: string
                    }
                    id: number;
                }
            };
            investigationGroupByGroupId: {
                investigationGroupReasonByReason : {
                    displayName: string | null;
                }
                otherReason: string | null;
            } | null;
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
        desk: investigation.deskByDeskId?.deskName,
        investigationGroupReasonByGroupId: {
            reason: investigation.investigationGroupByGroupId?
            (investigation.investigationGroupByGroupId.otherReason ? 
            investigation.investigationGroupByGroupId.otherReason :
            investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.displayName) : null
        }
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;

    return newObject;
}

const mappingGroupInvestigations = (investigation: UserInvestigations['orderedInvestigations']['nodes'][number]) => {
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
        desk: investigation.deskByDeskId?.deskName,
        investigationGroupReasonByGroupId: {
            reason: investigation.investigationGroupByGroupId?
            (investigation.investigationGroupByGroupId.otherReason ? 
            investigation.investigationGroupByGroupId.otherReason :
            investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.displayName) : null
        }
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;

    return newObject;
}
const mappingInvestigationsGroup = (investigation: GroupedIvestigations['allInvestigations']['nodes'][number]) => {
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
        desk: investigation.deskByDeskId?.deskName,
        investigationGroupReasonByGroupId: {
            reason: investigation.investigationGroupByGroupId.otherReason ? 
            investigation.investigationGroupByGroupId.otherReason :
            investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.displayName
        }
    };

    delete newObject.complexityCode;
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;

    return newObject;
}

export const convertUserInvestigationsData = (dbData: UserInvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingUserInvestigations);
}

export const convertGroupInvestigationsData = (dbData: GroupIvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingGroupInvestigations);
}

export const convertGroupedInvestigationsData = (dbData: GroupedIvestigations) => {
    return dbData.allInvestigations.nodes.map(mappingInvestigationsGroup);
}