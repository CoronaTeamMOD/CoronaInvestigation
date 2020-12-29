import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import InvestigationChart from 'models/InvestigationChart';
import InvestigationChartData from './InvestigationChartData';

import useStyles from './InvestigationBarChartStyles';

const InvestigationBarChart: React.FC<Props> = ({ investigationsGraphData }): JSX.Element => {

    const classes = useStyles();

    return (
        <ResponsiveBar
            data={investigationsGraphData}
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

interface Props {
    investigationsGraphData: InvestigationChart[];
}

export default InvestigationBarChart;
