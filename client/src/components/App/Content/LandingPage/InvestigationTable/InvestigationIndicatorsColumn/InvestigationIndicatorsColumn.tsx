import React, { useState, useEffect } from 'react';
import { ReplyAll } from '@material-ui/icons';
import { Tooltip, Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import SelfInvestigationIcon from './SelfInvestigationIcon/SelfInvestigationIcon';
import KeyValuePair from 'models/KeyValuePair';
import { TransferReasonCodes } from 'models/enums/TransferReasonCodes';

const complexInvestigationMessage = 'חקירה מורכבת';

const InvestigationIndicatorsColumn = (props: Props) => {
    const { isComplex, wasInvestigationTransferred, transferReason, complexityReasonsId, isInInstitute, instituteName, transferReasonId } = props;
    const allComplexReasons = useSelector<StoreStateType, (number|null)[]>(state => state.complexReasons);
    let investigationComplexityReasons = (complexityReasonsId) && complexityReasonsId.map((id) => (id) && allComplexReasons[id - 1]).filter((value, index, self) => self.indexOf(value) === index).toString()
    if(isInInstitute && instituteName){
        investigationComplexityReasons += ', שם המוסד: ' + instituteName; 
    }
    const complexInvestigationText = investigationComplexityReasons ? `${complexInvestigationMessage}: ${investigationComplexityReasons}` : `${complexInvestigationMessage}: אחר`;
    const toShowComplexityIcon: boolean = isComplex && complexityReasonsId !== null &&complexityReasonsId.length !== 0;

    return (
        <Box display='flex' alignItems='center' flexWrap='nowrap'>
            <Box flex={1} marginX={0.5}>
                {
                    toShowComplexityIcon && <ComplexityIcon tooltipText={complexInvestigationText} />
                }
            </Box>
            <Box flex={1} marginX={0.5}>
                {
                    wasInvestigationTransferred &&
                    <Tooltip title={transferReasonId === null ? '' : transferReasonId?.id == TransferReasonCodes.ANOTHER ? transferReason : transferReasonId?.displayName} placement='top' arrow>
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
    complexityReasonsId: (number|null)[];
    transferReason: string;
    isInInstitute: boolean;
    instituteName: string;
    transferReasonId:KeyValuePair;
};

export default InvestigationIndicatorsColumn;
