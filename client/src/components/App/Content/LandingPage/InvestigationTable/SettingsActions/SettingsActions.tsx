import React, { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { SvgIconComponent, MoreVert, CallSplit, LockOpen } from '@material-ui/icons';

import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

import useSettingsActions from './useSettingsActions'

interface settingsAction {
    key: number;
    icon: SvgIconComponent;
    disabled: boolean;
    disabledMessage: string;
    displayTitle: string;
    onClick: () => void;
}
    
const SettingsActions = (props: Props) => {

    const { epidemiologyNumber, investigationStatus, groupId, allGroupedInvestigations, checkGroupedInvestigationOpen,
            fetchTableData, fetchInvestigationsByGroupId, moveToTheInvestigationForm } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { excludeInvestigationFromGroup, reopenInvestigation } = useSettingsActions({ allGroupedInvestigations, setAnchorEl, fetchTableData, 
                                                                    fetchInvestigationsByGroupId, moveToTheInvestigationForm });
    
    const shouldExcludeDisabled = () => {
        return !(checkGroupedInvestigationOpen.includes(epidemiologyNumber) || Boolean(allGroupedInvestigations.get(groupId)))
    }

    const shouldReopenInvestigation = () => {
        return investigationStatus.id === InvestigationMainStatusCodes.DONE;
    }
    
    const settingsAction: settingsAction[]  = [
        {
            key: 1,
            icon: CallSplit,
            disabled: shouldExcludeDisabled(),
            disabledMessage: shouldExcludeDisabled() ? 'לחקירה אין קבוצה או שהקבוצה אינה נפתחה': '',
            displayTitle: 'הוצא חקירה מקבוצה',
            onClick: () => excludeInvestigationFromGroup(epidemiologyNumber, groupId)
        },
        {
            key: 2,
            icon: LockOpen,
            disabled: !shouldReopenInvestigation(),
            disabledMessage: !shouldReopenInvestigation() ? 'החקירה עדיין לא הושלמה' : '',
            displayTitle: 'פתיחה מחודשת',
            onClick: () => reopenInvestigation(epidemiologyNumber)
        }
    ]

    const onAnchorClick = (event: React.MouseEvent<HTMLElement>, target: HTMLElement | null) => {
        event.stopPropagation();
        setAnchorEl(target);
    }

    const onActionClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        settingsAction[index].onClick();
    }

    return (
        <>
            <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => onAnchorClick(event, event.currentTarget)}>
                <MoreVert color='primary'/>
            </IconButton>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                keepMounted
                onClose={(event: React.MouseEvent<HTMLElement>) => onAnchorClick(event, null)}
            >
                {
                    settingsAction.map((action: settingsAction, index: number) => {
                        return (
                            <Tooltip title={action.disabledMessage} placement='top-end'>
                                <span>                                
                                    <MenuItem
                                        key={action.key}
                                        disabled={action.disabled}
                                        onClick={(event: React.MouseEvent<HTMLElement>) => onActionClick(event, index)}
                                    >
                                        {React.createElement(action.icon)}
                                        <Typography>{action.displayTitle}</Typography>
                                    </MenuItem>
                                </span>
                            </Tooltip>
                        )
                    })
                }   
            </Menu>
        </>
    );
};

interface Props {
    epidemiologyNumber: number;
    investigationStatus: InvestigationMainStatus;
    groupId: string;
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    checkGroupedInvestigationOpen: number[];
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
}

export default SettingsActions;
