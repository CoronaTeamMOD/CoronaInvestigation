import React from 'react';
import { IconButton, Typography, useMediaQuery } from '@material-ui/core';

import useStyle from './FooterActionStyles';
import { CardActionDescription } from '../InvestigationTableFooter';

const FooterAction: React.FC<Props> = ({ icon, displayTitle, onClick, disabled }) => {
    
    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyle(isScreenWide)();

    return (
        <IconButton
            disabled={disabled}
            onClick={onClick}
            classes={{label: classes.button}}
        >
            {React.createElement(icon, { className: `${classes.icon} ${disabled ? classes.disabled: null}` })}
            <Typography>{displayTitle}</Typography>
        </IconButton>
    )
};

export default FooterAction;

interface Props extends CardActionDescription {

}