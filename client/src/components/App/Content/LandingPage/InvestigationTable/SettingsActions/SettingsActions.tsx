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

    return (
        <>
            <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                setAnchorEl(event.currentTarget);
            }}>
                <MoreVert color='primary'/>
            </IconButton>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                keepMounted
                onClose={(event: React.MouseEvent<HTMLElement>) => { event.stopPropagation(); setAnchorEl(null) }}
            >
                {
                    settingsAction.map((action: settingsAction) => {
                        return (
                            <MenuItem
                                key={action.key}
                                disabled={action.disabled}
                                onClick={(event: React.MouseEvent<HTMLElement>) => {
                                    event.stopPropagation();
                                    action.onClick()
                                }}
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
