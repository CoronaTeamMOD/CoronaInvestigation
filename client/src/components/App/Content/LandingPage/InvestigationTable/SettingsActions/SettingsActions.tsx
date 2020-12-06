import React, { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { SvgIconComponent, MoreVert, CallSplit } from '@material-ui/icons';

import useSettingsActions from './useSettingsActions'

interface settingsAction {
    key: number;
    icon: SvgIconComponent;
    displayTitle: string;
    disabled: boolean;
    onClick: () => void;
}
    
const SettingsActions = ({ epidemiologyNumber, groupId, fetchTableData }: Props) => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { excludeInvestigationFromGroup } = useSettingsActions({ fetchTableData, setAnchorEl });

    const settingsAction: settingsAction[]  = [
        {
            key: 1,
            icon: CallSplit,
            disabled: groupId === null,
            displayTitle: 'הוצא חקירה מקבוצה',
            onClick: () => excludeInvestigationFromGroup(epidemiologyNumber)
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
                            <MenuItem
                                key={action.key}
                                disabled={action.disabled}
                                onClick={(event: React.MouseEvent<HTMLElement>) => onActionClick(event, index)}
                            >
                                {React.createElement(action.icon)}
                                <Typography>{action.displayTitle}</Typography>
                            </MenuItem>
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
    fetchTableData: () => void;
}

export default SettingsActions;
