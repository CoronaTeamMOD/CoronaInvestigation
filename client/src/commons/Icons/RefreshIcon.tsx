import React from 'react'
import { Tooltip } from '@material-ui/core';
import Refresh from '@material-ui/icons/Refresh';

const refreshText = 'רענן';

interface Props {
    className: string;
    onClick: () => void;
}

const RefreshIcon = (props : Props) => {
    const { className , onClick } = props;

    return (
        <Tooltip title={refreshText} arrow>
            <Refresh className={className} onClick={onClick}/>
        </Tooltip>
    )
}

export default RefreshIcon;
