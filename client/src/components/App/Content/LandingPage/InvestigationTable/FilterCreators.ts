import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { investigationStatus: { in: values } }
            :
            {};
    },
    [InvestigationsFilterByFields.DESK_ID]: (values: number[]) => {
        return values.length > 0 ?
            { deskId: { in: values } }
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
    }
};

export default filterCreators;