import { differenceInYears } from 'date-fns';

interface GroupedInvestigations {
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

const mappingInvestigationsGroup = (investigation: GroupedInvestigations['allInvestigations']['nodes'][number]) => {
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

export const convertGroupedInvestigationsData = (dbData: GroupedInvestigations) => {
    return dbData.allInvestigations.nodes.map(mappingInvestigationsGroup);
}
