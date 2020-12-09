import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { investigationStatus: { in: values } }
            :
            { investigationStatus: null };
    },
    [InvestigationsFilterByFields.DESK_ID]: (values: number[]) => {
        return values.length > 0 ?
            { deskId: { in: values } }
            :
            { deskId: null };
    },
    [InvestigationsFilterByFields.FULL_NAME]: (values: string) => {
        return Boolean(values) ?
            {
                investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { equalTo: values } } },
                or: [
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: "" } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: "" } } } }]
            } :
            {
                investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: "" } } },
                or: [
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: "" } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: "" } } } }]
            };
    },
    [InvestigationsFilterByFields.NUMERIC_PROPERTIES]: (values: string) => {
        return Boolean(values) ?
            {
                investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: "" } } },
                or: [{ epidemiologyNumber: { equalTo: Number(values) } },
                { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { equalTo: values } } } },
                { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { equalTo: values } } } }]
            } :
            {
                investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: "" } } },
                or: [
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: "" } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: "" } } } }]
            }
    }
};

export default filterCreators;