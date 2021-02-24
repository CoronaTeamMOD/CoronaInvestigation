import React from 'react';
import { ReplyAll } from '@material-ui/icons';
import { Tooltip , Box } from '@material-ui/core';

import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import SelfInvestigationIcon from './SelfInvestigationIcon/SelfInvestigationIcon';

const complexInvestigationMessage = 'חקירה מורכבת';

const InvestigationIndicatorsColumn = (props: Props) => {
    const { isComplex, wasInvestigationTransferred, transferReason , isSelfInvestigated ,selfInvestigationStatus, selfInvestigationUpdateTime, complexityReasonsId} = props;
    const complexInvestigationText = `${complexInvestigationMessage}: ${complexityReasonsId}`
    return (
        <Box display='flex' alignItems='center' flexWrap='nowrap'>
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
                    isComplex && <ComplexityIcon tooltipText={complexInvestigationText} />
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
    complexityReasonsId: Array<number | null>;
    transferReason: string;
    isSelfInvestigated : boolean;
    selfInvestigationStatus : number;
    selfInvestigationUpdateTime : Date;
};

export default InvestigationIndicatorsColumn;
