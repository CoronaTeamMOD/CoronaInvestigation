import React from 'react';
import { Star } from '@material-ui/icons';
import { SvgIconProps, Tooltip } from '@material-ui/core';

import useStyles from './ComplexityIconStyles';

const ComplexityIcon: React.FC<Props> = (props: Props) => {
    
    const { className, tooltipText, ...otherProps } = props

    const classes = useStyles();

    return (
        <Tooltip title={tooltipText} placement='top' arrow>
            <Star className={[classes.icon, className].join(' ')} {...otherProps} />
        </Tooltip>
    )
}

interface Props extends SvgIconProps {
    tooltipText: string;
};

export default ComplexityIcon;
