import React, { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { SvgIconComponent, MoreVert, CallSplit } from '@material-ui/icons';

import InvestigationTableRow from 'models/InvestigationTableRow';

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

    const { epidemiologyNumber, groupId, allGroupedInvestigations, checkGroupedInvestigationOpen,
            fetchTableData, fetchInvestigationsByGroupId } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { excludeInvestigationFromGroup } = useSettingsActions({ allGroupedInvestigations, setAnchorEl, fetchTableData, fetchInvestigationsByGroupId });
    
    const shouldExcludeDisabled = () => {
        return !(checkGroupedInvestigationOpen.includes(epidemiologyNumber) || Boolean(allGroupedInvestigations.get(groupId)))
    }
    
    const settingsAction: settingsAction[]  = [
        {
            key: 1,
            icon: CallSplit,
            disabled: shouldExcludeDisabled(),
            disabledMessage: shouldExcludeDisabled() ? 'לחקירה אין קבוצה או שהקבוצה אינה נפתחה': '',
            displayTitle: 'הוצא חקירה מקבוצה',
            onClick: () => excludeInvestigationFromGroup(epidemiologyNumber, groupId)
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
    groupId: string;
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    checkGroupedInvestigationOpen: number[];
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
}

export default SettingsActions;
