import React from 'react';

import useStyles from './PatientInfoItemStyles';
import InfoItem, { InfoItemProps } from '../../InfoItem';

interface Props extends InfoItemProps {
};

const PatientInfoItem = ({ name, value, testId }: Props) => {
    const classes = useStyles();
    return (
        <div className={classes.additionalInfoItem}>
            <InfoItem name={name} value={value} testId={testId} />
        </div>
    );
};

export default InfoItem;