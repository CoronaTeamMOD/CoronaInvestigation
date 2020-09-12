import React from 'react';
import { SvgIconComponent } from '@material-ui/icons';

import useStyles from './InfoItemWithIconStyles';
import InfoItem, { InfoItemProps } from '../../InfoItem';

interface Props extends InfoItemProps {
    icon: SvgIconComponent;
};

const InfoItemWithIcon = ({ name, value, icon, testId }: Props) => {
    const classes = useStyles();
    return (
        <div className={classes.additionalInfoItem}>
            {React.createElement(icon, { className: classes.infoIcon })}
            <InfoItem name={name} value={value} testId={testId} />
        </div>
    );
};

export default InfoItemWithIcon;