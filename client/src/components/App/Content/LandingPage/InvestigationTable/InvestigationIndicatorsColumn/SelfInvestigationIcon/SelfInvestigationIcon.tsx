import React, { useState } from 'react';
import { Popover, Tooltip, ClickAwayListener, IconButton , Typography } from '@material-ui/core';

import useStyles from './selfInvestigationIconStyles';
import useSelfInvestigationIcon from './useSelfInvestigationIcon';
import SelfInvestigationPopover from './Popover/SelfInvestigationPopover';

const contactTitle = 'טופס תחקור עצמי';
interface Props {
    status: number;
    date: Date;
}

const SelfInvestigationIcon = (props: Props) => {
	const {status , date} = props;

	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const classes = useStyles();
	const handleTooltipClose = (e: any) => {
		e.stopPropagation();
		setIsTooltipOpen(false);
		setAnchorEl(null);
	}
	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget)
		setIsTooltipOpen((isOpen) => !isOpen);
	}
	const { getIconByStatus } = useSelfInvestigationIcon({status});

	return (
        <>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip title={contactTitle} arrow placement={'top'}>
                    <IconButton className={classes.icon} onClick={handleButtonClick}>{getIconByStatus()}</IconButton>
                </Tooltip>
            </ClickAwayListener>
            <Popover
                anchorEl={anchorEl}
                open={isTooltipOpen}
                onClose={handleTooltipClose}
                onClick={handleTooltipClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Typography className={classes.popover}>
                    <SelfInvestigationPopover date={date} status={status} />
                </Typography>
            </Popover>
        </>
    );
};

export default SelfInvestigationIcon;
