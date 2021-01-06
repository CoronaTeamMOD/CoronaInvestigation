import React from 'react';
import { Tooltip , Box } from '@material-ui/core';
import { ReplyAll } from '@material-ui/icons';

import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import useStyles from './InvestigationIndicatorsColumnStyles';
import SelfInvestigationIcon from './SelfInvestigationIcon/SelfInvestigationIcon';

const complexInvestigationMessage = 'חקירה מורכבת';

const InvestigationIndicatorsColumn = (props: Props) => {
    const { isComplex, wasInvestigationTransferred, transferReason , isSelfInvestigated ,selfInvestigationStatus, selfInvestigationUpdateTime} = props;

    const classes = useStyles();

    return (
        <Box display='flex' alignItems='center' flexWrap="nowrap">
            <Box flex={1} marginX={0.5}>
                {
                    isSelfInvestigated &&
                    <SelfInvestigationIcon 
                        status={selfInvestigationStatus}
                        date={selfInvestigationUpdateTime}
                    />
                }
            </Box>
            <Box flex={1} marginX={0.5}>
                {
                    isComplex && <ComplexityIcon tooltipText={complexInvestigationMessage} />
                }
            </Box>
            <Box flex={1} marginX={0.5}>
            {
                wasInvestigationTransferred &&
                <Tooltip title={transferReason === null ? '' : transferReason} placement='top' arrow>
                    <ReplyAll color='primary' />
                </Tooltip>
            }
            </Box>
        </Box>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    isComplex: boolean;
    transferReason: string;
    isSelfInvestigated : boolean;
    selfInvestigationStatus : number;
    selfInvestigationUpdateTime : Date
};

export default InvestigationIndicatorsColumn;
