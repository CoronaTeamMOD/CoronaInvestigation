import { getPatientAge } from '../../Utils/patientUtils';
import InvestigationMainStatus from '../../Models/InvestigationStatus/InvestigationMainStatus';

interface GroupedInvestigations {
    allInvestigations: {
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
            investigationStatusByInvestigationStatus: InvestigationMainStatus
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
                investigationGroupReasonByReason: {
                    displayName: string | null;
                    id: number | null;
                }
                otherReason: string | null;
            } | null;
        }]
    }
}

const mappingInvestigationsGroup = (investigation: GroupedInvestigations['allInvestigations']['nodes'][number]) => {
    const newObject = {
        ...investigation,
        complexityReasonsId: investigation.complexityReasonsId,
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
    delete newObject.deskByDeskId;
    delete newObject.investigationGroupByGroupId;

    return newObject;
}

export const convertGroupedInvestigationsData = (dbData: GroupedInvestigations) => {
    return dbData.allInvestigations.nodes.map(mappingInvestigationsGroup);
}
