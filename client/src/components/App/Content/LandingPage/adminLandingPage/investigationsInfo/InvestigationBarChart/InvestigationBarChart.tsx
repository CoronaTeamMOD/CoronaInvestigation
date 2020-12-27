import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import InvestigationChartData from './InvestigationChartData';

const InvestigationBarChart: React.FC = (): JSX.Element => {
    return (
        <ResponsiveBar
            data={InvestigationChartData}
            borderRadius={9}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            isInteractive={false}
            colors={investigationChart => investigationChart.data.color}
        />
    )
};

export default InvestigationBarChart;
