import React from 'react';
import { Tooltip } from '@material-ui/core';
import CallMerge from '@material-ui/icons/CallMerge';

const contactTitle = 'מגע מחקירה מקובצת';

const GroupedContactIcon: React.FC = () => {

    return (
        <Tooltip title={contactTitle} arrow>
            <CallMerge />
        </Tooltip>
    );
};

export default GroupedContactIcon;
