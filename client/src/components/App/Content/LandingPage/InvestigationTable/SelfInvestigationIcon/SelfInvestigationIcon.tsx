import React, { useState } from 'react';
import { Popover, Tooltip, ClickAwayListener, IconButton , Typography } from '@material-ui/core';

import useStyles from './selfInvestigationIconStyles';
import useSelfInvestigationIcon from './useSelfInvestigationIcon';

const contactTitle = 'טופס תחקור עצמי';
interface Props {
    status: number;
    date: Date;
}

const SelfInvestigationIcon = (props: Props) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const classes = useStyles();
	const handleTooltipClose = (e : React.MouseEvent<Document, MouseEvent>) => {
		e.stopPropagation();
		setIsTooltipOpen(false);
		setAnchorEl(null);
	}
	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget)
		setIsTooltipOpen((isOpen) => !isOpen);
	}
	const {getTooltipText , getIconByStatus} = useSelfInvestigationIcon(props);

	return (
		<>
			<ClickAwayListener onClickAway={handleTooltipClose}>
				<Tooltip title={contactTitle} arrow placement={'top'}>
					<IconButton onClick={handleButtonClick}>{getIconByStatus()}</IconButton>
				</Tooltip>
			</ClickAwayListener>
			<Popover
				anchorEl={anchorEl}
				open={isTooltipOpen}
				onClose={handleTooltipClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<Typography className={classes.popover}>{getTooltipText()}</Typography>
			</Popover>
		</>
	);
};

export default SelfInvestigationIcon;
