import React from 'react';
import { Star } from '@material-ui/icons';
import { SvgIconProps, Tooltip } from '@material-ui/core';

import useStyles from './ComplexityIconStyles';
const abroadText = 'חזר מחו"ל';
const contactAbroadText = 'מגע עם חוזר חו"ל';

const ComplexityIcon: React.FC<Props> = (props: Props) => {
    
    const { className, tooltipText, isVarient, ...otherProps } = props
    let colors = isVarient ? {fill: 'red'} : {};
    colors = (tooltipText.indexOf(abroadText) != -1 || 
              tooltipText.indexOf(contactAbroadText) != -1) ? {fill: 'green'} : colors;
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
