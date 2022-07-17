import { getPatientAge } from '../../Utils/patientUtils';
import InvestigationMainStatus from '../../Models/InvestigationStatus/InvestigationMainStatus';
import investigationInfo from '../InvestigationInfo/mainRoute';

// All the different interfaces and functions are there for decoupling the user and the group investigations

interface UserInvestigations {
    orderedUserInvestigations: {
        nodes: [{
            complexityReasonsId: (number | null)[];
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
            botInvestigationByEpidemiologyNumber: {
                lastChatDate: Date,
                chatStatusByChatStatusId: {
                    id: number,
                    displayName: string,
                },
                investigatiorReferenceRequired: boolean,
                investigatorReferenceStatusByInvestigatorReferenceStatusId: {
                    id: number,
                    displayName: string,
                },
                botInvestigationReferenceReasonsByBotInvestigationId: {
                    nodes: [
                        investigatorReferenceReasonByInvestigatorReferenceReasonId: {
                            displayName: string,
                            id: number,
                        }
                    ]
                } | null
            } | null;
            lastUpdatorUser:string;
        }]
    }
}

interface GroupInvestigations {
    orderedInvestigations: {
        nodes: [{
            complexityReasonsId: (number | null)[];
            comment: string;
            epidemiologyNumber: number;
            complexityCode: number;
            priority: number;
            statusReason: string;
            transferReason: string;
            trasferReasonByTransferReasonId:{
                id: number;
                displayName: string;
            };
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
            botInvestigationByEpidemiologyNumber: {
                lastChatDate: Date,
                chatStatusByChatStatusId: {
                    id: number,
                    displayName: string,
                },
                investigatiorReferenceRequired: boolean,
                investigatorReferenceStatusByInvestigatorReferenceStatusId: {
                    id: number,
                    displayName: string,
                } | null,
                botInvestigationReferenceReasonsByBotInvestigationId: {
                    nodes: [
                        investigatorReferenceReasonByInvestigatorReferenceReasonId: {
                            displayName: string,
                            id: number,
                        }
                    ]
                } | null,
            } | null;
            lastUpdatorUser:string;
        }]
    }
}

const mappingUserInvestigations = (investigation: UserInvestigations['orderedUserInvestigations']['nodes'][number]) => {
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
        },
        botInvestigation: {
            ...investigation.botInvestigationByEpidemiologyNumber,
            chatStatus: investigation.botInvestigationByEpidemiologyNumber?.chatStatusByChatStatusId,
            investigatorReferenceStatus: investigation.botInvestigationByEpidemiologyNumber?.investigatorReferenceStatusByInvestigatorReferenceStatusId,
            investigatorReferenceReasons: investigation.botInvestigationByEpidemiologyNumber?.botInvestigationReferenceReasonsByBotInvestigationId.nodes.map((obj: any) => obj.investigatorReferenceReasonByInvestigatorReferenceReasonId)
        }
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;
    delete newObject.botInvestigationByEpidemiologyNumber;
    delete newObject.botInvestigation.chatStatusByChatStatusId;
    delete newObject.botInvestigation.investigatorReferenceStatusByInvestigatorReferenceStatusId;
    delete newObject.botInvestigation.botInvestigationReferenceReasonsByBotInvestigationId;


    return newObject;
}

const mappingGroupInvestigations = (investigation:GroupInvestigations['orderedInvestigations']['nodes'][number]) => {
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
        }//,
        // botInvestigation: {
        //     ...investigation.botInvestigationByEpidemiologyNumber,
        //     chatStatus: investigation.botInvestigationByEpidemiologyNumber?.chatStatusByChatStatusId,
        //     investigatorReferenceStatus: investigation.botInvestigationByEpidemiologyNumber?.investigatorReferenceStatusByInvestigatorReferenceStatusId,
        //     investigatorReferenceReasons: investigation.botInvestigationByEpidemiologyNumber?.botInvestigationReferenceReasonsByBotInvestigationId.nodes.map((obj: any) => obj.investigatorReferenceReasonByInvestigatorReferenceReasonId),
        // }
    };

    delete newObject.complexityCode;
    delete newObject.investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient.birthDate;
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;
    // delete newObject.botInvestigationByEpidemiologyNumber;
    // delete newObject.botInvestigation.chatStatusByChatStatusId;
    // delete newObject.botInvestigation.investigatorReferenceStatusByInvestigatorReferenceStatusId;
    // delete newObject.botInvestigation.botInvestigationReferenceReasonsByBotInvestigationId;
  
    return newObject;
}

export const convertUserInvestigationsData = (dbData: UserInvestigations) => {
    return dbData.orderedUserInvestigations.nodes.map(mappingUserInvestigations);
}

export const convertGroupInvestigationsData = (dbData: GroupInvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingGroupInvestigations);
}