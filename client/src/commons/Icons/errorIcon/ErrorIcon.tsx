import React from 'react';
import { Error } from '@material-ui/icons';
import { SvgIconProps, Tooltip } from '@material-ui/core';

import useStyles from './ErrorIconStyles';

const ErrorIcon: React.FC<Props> = (props: Props) => {
    
    const { className, tooltipText, ...otherProps } = props
    const classes = useStyles();

    return (
        <Tooltip classes={{popper:classes.tooltipSize}} title={tooltipText} placement='top' arrow>
            <Error className={[classes.icon, className].join(' ')} {...otherProps} />
        </Tooltip>
    )
}

interface Props extends SvgIconProps {
    tooltipText: string;
};

export default ErrorIcon;
