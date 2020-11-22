import { differenceInYears } from 'date-fns';

interface DBInvestigations {
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

const mappingDBData = (investigation: DBInvestigations['orderedInvestigations']['nodes'][number]) => {
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

export const convertOrderedInvestigationsData = (dbData: DBInvestigations) => {
    return dbData.orderedInvestigations.nodes.map(mappingDBData);
}