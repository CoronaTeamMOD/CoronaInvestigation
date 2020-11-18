import React from 'react';
import {Tooltip, TooltipProps} from '@material-ui/core';

const ConditionalTooltip = ({renderTooltip,children, ...props}: Props) => {
    return (
        renderTooltip
            ? <Tooltip {...props}>
                <span>{children}</span>
            </Tooltip>
            : children
    );
};

interface Props extends TooltipProps {
    renderTooltip: boolean;
}

export default ConditionalTooltip;