import React from 'react';
import { Tooltip } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';

const contactTitle = 'מגע חינוך';

const EducationContactIcon: React.FC = () => {

    return (
        <Tooltip title={contactTitle} arrow>
            <SchoolIcon/>
        </Tooltip>
    );
};

export default EducationContactIcon;
