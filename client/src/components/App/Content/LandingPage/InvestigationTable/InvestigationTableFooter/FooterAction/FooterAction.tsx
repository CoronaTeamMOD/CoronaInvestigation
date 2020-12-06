import React from 'react';
import { IconButton, Tooltip, Typography, useMediaQuery } from '@material-ui/core';

import useStyle from './FooterActionStyles';
import { CardActionDescription } from '../InvestigationTableFooter';

const FooterAction: React.FC<Props> = ({ icon, displayTitle, onClick, disabled, errorMessage }) => {
    
    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyle(isScreenWide)();

    return (
        <Tooltip title={errorMessage}>
            <span>
                <IconButton
                    disabled={disabled}
                    onClick={onClick}
                    classes={{label: classes.button}}
                >
                    {React.createElement(icon, { className: `${classes.icon} ${disabled ? classes.disabled: null}` })}
                    <Typography>{displayTitle}</Typography>
                </IconButton>
            </span>
        </Tooltip>
    ) 
};

export default FooterAction;

interface Props extends CardActionDescription {

}