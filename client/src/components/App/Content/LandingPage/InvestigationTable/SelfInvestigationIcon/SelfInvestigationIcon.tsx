import React, { useState } from 'react';
import { Tooltip, ClickAwayListener, IconButton } from '@material-ui/core';

import useStyles from './selfInvestigationIconStyles';
import useSelfInvestigationIcon from './useSelfInvestigationIcon';

interface Props {
    status: number;
    date: Date;
}

const SelfInvestigationIcon = (props: Props) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

	const classes = useStyles();

	const handleTooltipClose = () => setIsTooltipOpen(false);
	const handleTooltipToggle = (event: any) => {
		event.stopPropagation();
		setIsTooltipOpen((isOpen) => !isOpen);
	};

	const {getTooltipText , getIconByStatus} = useSelfInvestigationIcon(props);

	return (
		<ClickAwayListener onClickAway={handleTooltipClose}>
			<Tooltip
                classes={{tooltip:classes.lightTooltip, popper: classes.popper}}
				PopperProps={{
					disablePortal: true,
					placement: 'bottom-start',
					modifiers: {
						offset: {
							enabled: true,
							offset: '20px, 0',
						},
					},
				}}
				onClose={handleTooltipClose}
				open={isTooltipOpen}
				disableHoverListener
				title={getTooltipText()}
			>
				<IconButton onClick={handleTooltipToggle}>{getIconByStatus()}</IconButton>
			</Tooltip>
		</ClickAwayListener>
	);
};

export default SelfInvestigationIcon;
