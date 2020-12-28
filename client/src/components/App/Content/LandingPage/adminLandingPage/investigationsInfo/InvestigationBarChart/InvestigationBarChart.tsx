import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import InvestigationChartData from './InvestigationChartData';
import useStyles from './InvestigationBarChartStyles';

const InvestigationBarChart: React.FC = (): JSX.Element => {

    const classes = useStyles();

    return (
        <ResponsiveBar
            data={InvestigationChartData}
            borderRadius={9}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            isInteractive={true}
            tooltip={({indexValue, color, value}) => {
                return (
                    <b style={{color}} className={classes.barTooltip}>{indexValue}: {value}</b>
                )
            }}
            colors={investigationChart => investigationChart.data.color}
        />
    )
};

export default InvestigationBarChart;
