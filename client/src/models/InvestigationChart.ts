import statusToFilterConvertor from 'commons/statusToFilterConvertor';

interface InvestigationChart {
    id: keyof typeof statusToFilterConvertor;
    value: number;
    color: string;
    space?: number;
};

export default InvestigationChart;
