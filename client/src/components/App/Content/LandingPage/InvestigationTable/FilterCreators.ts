import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const unassignedUserName = 'לא משויך';

const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { investigationStatus: { in: values } }
            :
            {};
    },
    [InvestigationsFilterByFields.DESK_ID]: (deskIds: number[]) => {
        if (deskIds.includes(-1)) {
            return {
                or: [
                    { deskId: { in: deskIds.filter(deskId => deskId !== -1) } },
                    { deskId: { isNull: true } }
                ]
            }
        }

        return deskIds.length > 0 ?
            { deskId: { in: deskIds } }
            :
            {};
    },
    [InvestigationsFilterByFields.FULL_NAME]: (values: string) => {
        return Boolean(values) ?
            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: values } } } } :
            {};
    },
    [InvestigationsFilterByFields.NUMERIC_PROPERTIES]: (values: string) => {
        return Boolean(values) ?
            {
                or: [
                    { epidemiologyNumber: { equalTo: Number(values) } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: values } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: values } } } }
                ]
            } :
            {}
    },
    [InvestigationsFilterByFields.UNASSIGNED_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            { userName: {equalTo: unassignedUserName} }
            :
            {};
    },
    [InvestigationsFilterByFields.INACTIVE_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            { isActive: {equalTo: false} }
            :
            {};
    },
};

export default filterCreators;