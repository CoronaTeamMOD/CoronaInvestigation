import React from 'react';
import { Star } from '@material-ui/icons';
import { SvgIconProps, Tooltip } from '@material-ui/core';

import useStyles from './ComplexityIconStyles';

const ComplexityIcon: React.FC<Props> = (props: Props) => {
    
    const { className, tooltipText, isVarient, ...otherProps } = props
    const colors = isVarient ? {fill: 'red'} : {};
    const classes = useStyles();

    return (
        <Tooltip classes={{popper:classes.tooltipSize}} title={tooltipText} placement='top' arrow>
            <Star style={colors} className={[classes.icon, className].join(' ')} {...otherProps} />
        </Tooltip>
    )
}

interface Props extends SvgIconProps {
    tooltipText: string;
    isVarient?: boolean | undefined;
};

export default ComplexityIcon;
