import React from 'react';
import {Comment} from '@material-ui/icons';
import {Tooltip, ClickAwayListener, IconButton} from '@material-ui/core';

import useStyles from './commentDisplayStyles';

const noCommentMessage = 'אין הערה';

const CommentDisplay = ({comment}: Props) => {
    const [isTooltipOpen, setIsTooltipOpen] = React.useState<boolean>(false);

    const handleTooltipClose = () => setIsTooltipOpen(false);
    const handleTooltipToggle = (event:any) => {
        event.stopPropagation();
        setIsTooltipOpen(isOpen => !isOpen);
    };

    const classes = useStyles();

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip classes={{tooltip:classes.lightTooltip, popper: classes.popper}}
            PopperProps={{
              disablePortal: true,
              placement: 'bottom-start',
              modifiers: {
                offset: {
                  enabled: true,
                  offset: '20px, 0',
                },
              },
            }}
            onClose={handleTooltipClose}
            open={isTooltipOpen}
            title={comment || noCommentMessage}>
                  <IconButton onClick={handleTooltipToggle}>
                      <Comment color={comment ? 'primary' : 'disabled'}/>
                  </IconButton>
          </Tooltip>
      </ClickAwayListener>
    )
}

interface Props {
    comment: string | null;
}

export default CommentDisplay;