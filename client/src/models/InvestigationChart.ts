import statusToFilterConvertor from 'commons/statusToFilterConvertor';

interface InvestigationChart {
    id: keyof typeof statusToFilterConvertor;
    value: number;
    color: string;
};

export default InvestigationChart;
