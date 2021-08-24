import { getPatientAge } from '../../Utils/patientUtils';
import InvestigationMainStatus from '../../Models/InvestigationStatus/InvestigationMainStatus';

// All the different interfaces and functions are there for decoupling the user and the group investigations

interface UserInvestigations {
    orderedInvestigations: {
        nodes: [{
            complexityReasonsId: (number|null)[];
            comment: string;
            epidemiologyNumber: number;
            complexityCode: number;
            priority: number;
            statusReason: string;
            transferReason: string;
            wasInvestigationTransferred: boolean;
            deskByDeskId: {
                deskName: string;
            } | null;
            investigatedPatientByInvestigatedPatientId: {
                investigatedPatientRoleByRole: {
                    id: number;
                    displayName: string;
                  }
                subOccupationBySubOccupation: {
                    displayName: string;
                    parentOccupation: string;
                  }
                covidPatientByCovidPatient: {
                    birthDate: Date;
                    fullName: string;
                    primaryPhone: string;
                    addressByAddress: {
                        cityByCity: {
                            displayName: string;
                        } | null
                    } | null,
                    validationDate: Date
                }
            };
            investigationStatusByInvestigationStatus: InvestigationMainStatus;
            investigationSubStatusByInvestigationSubStatus: {
                displayName: string;
            } | null;
            userByCreator: {
                id: string;
                userName: string;
                isActive: boolean;
            };
            investigationGroupByGroupId: {
                investigationGroupReasonByReason: {
                    displayName: string;
                    id: number;
                }
                otherReason: string;
            } | null;
        }]
    }
}

interface GroupIvestigations {
    orderedInvestigations: {
        nodes: [{
            complexityReasonsId: (number|null)[];
            comment: string;
            epidemiologyNumber: number;
            complexityCode: number;
            priority: number;
            statusReason: string;
            transferReason: string;
            wasInvestigationTransferred: boolean;
            deskByDeskId: {
                deskName: string;
            } | null;
            investigatedPatientByInvestigatedPatientId: {
                investigatedPatientRoleByRole: {
                    id: number;
                    displayName: string;
                  }
                subOccupationBySubOccupation: {
                    displayName: string;
                    parentOccupation: string;
                  }
                covidPatientByCovidPatient: {
                    birthDate: Date;
                    fullName: string;
                    primaryPhone: string;
                    addressByAddress: {
                        cityByCity: {
                            displayName: string;
                        } | null
                    } | null;
                    validationDate: Date;
                }
            };
            investigationStatusByInvestigationStatus: InvestigationMainStatus,
            investigationSubStatusByInvestigationSubStatus: {
                displayName: string;
            } | null;
            userByCreator: {
                id: string;
                userName: string;
                isActive: boolean;
                countyByInvestigationGroup: {
                    districtByDistrictId: {
                        displayName: string;
                    }
                    displayName: string;
                }
            };
            investigationGroupByGroupId: {
                investigationGroupReasonByReason: {
                    displayName: string | null;
                    id: number;
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
                age: getPatientAge(investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate)
            }
        },
        desk: investigation.deskByDeskId?.deskName,
        investigationGroupReasonByGroupId: {
            otherReason: investigation.investigationGroupByGroupId?.otherReason,
            reason: investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.displayName,
            reasonId: investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.id
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
                age: getPatientAge(investigation.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate)
            }
        },
        desk: investigation.deskByDeskId?.deskName,
        investigationGroupReasonByGroupId: {
            otherReason: investigation.investigationGroupByGroupId?.otherReason,
            reason: investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.displayName,
            reasonId: investigation.investigationGroupByGroupId?.investigationGroupReasonByReason.id
        }
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
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

const orderByAge = 'ageASC';
const defaultOrder = 'defaultOrder';

export const calculateInvestigationOrder = (orderBy: string) => {
    return orderBy === defaultOrder ? orderByAge : orderBy;
}