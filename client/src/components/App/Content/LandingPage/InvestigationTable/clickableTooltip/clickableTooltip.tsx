import React from 'react';
import {Tooltip, ClickAwayListener, IconButton} from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import useStyles from './clickableTooltipStyles';

const ClickableTooltip = ({value, defaultValue, scrollableRef, InputIcon, disabled = false}: Props) => {
    const [isTooltipOpen, setIsTooltipOpen] = React.useState<boolean>(false);

    const handleTooltipClose = () => setIsTooltipOpen(false);
    const handleTooltipToggle = (event:any) => {
        event.stopPropagation();
        setIsTooltipOpen(isOpen => !isOpen);
    };

    React.useEffect(() => {
        scrollableRef?.addEventListener('scroll', handleTooltipClose)
        return () => scrollableRef?.removeEventListener('scroll', handleTooltipClose)
    }, []);

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
                   disableHoverListener
            title={value || defaultValue || ''}>
                  <IconButton disabled={disabled} onClick={handleTooltipToggle}>
                      <InputIcon color={value ? 'primary' : 'disabled'}/>
                  </IconButton>
          </Tooltip>
      </ClickAwayListener>
    )
}

interface Props {
    value: string | null;
    defaultValue?: string;
    scrollableRef?: HTMLElement;
    InputIcon: SvgIconComponent;
    disabled?: boolean;
}

export default ClickableTooltip;