import React from 'react';
import { Tooltip } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/GroupOutlined';

const contactTitle = 'מגע משפחה';

const FamilyContactIcon: React.FC = () => {

    return (
        <Tooltip title={contactTitle} arrow>
            <PeopleIcon/>
        </Tooltip>
    );
};

export default FamilyContactIcon;
