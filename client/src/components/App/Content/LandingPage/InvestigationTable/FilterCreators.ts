import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any[]) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            {investigationStatus: {in: values}}
            :
            {investigationStatus: null};
    },
    [InvestigationsFilterByFields.DESK_ID]: (values: number[]) => {
        return values.length > 0 ?
            {deskId: {in: values}}
            :
            {deskId: null};
    }
};

export default filterCreators;