import React from 'react';
import { ResponsivePie } from '@nivo/pie';

import InvestigationChartData from './InvestigationChartData';

const InvestigationPieChart: React.FC = (): JSX.Element => {
    return (
        <ResponsivePie
            data={InvestigationChartData}
            enableRadialLabels={false}
            enableSliceLabels={false}
            innerRadius={0.8}
            borderWidth={2}
            borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
            colors={investigationChart => investigationChart.data.color}
        />
    )
};

export default InvestigationPieChart;
