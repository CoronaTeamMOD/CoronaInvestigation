import React from 'react';
import {ToggleButton} from '@material-ui/lab';
import ToggleButtonGroup, {ToggleButtonGroupProps} from '@material-ui/lab/ToggleButtonGroup';

import useStyles from './IsActiveToggleStyles';
import { useTheme } from '@material-ui/core';

const IsActiveToggle: React.FC<Props> = React.forwardRef((props: Props, ref): JSX.Element => {
    const classes = useStyles();
    const {value, onToggle, ...rest} = props;
    const theme = useTheme();

    const activeButtonStyle = {
        backgroundColor: theme.palette.success.dark,
        color: 'white'
    };

    const notActiveButtonStyle = {
        backgroundColor: theme.palette.error.main,
        color: 'white'
    };

    return(
        <ToggleButtonGroup {...rest} ref={ref} value={value} exclusive size='small' className={classes.isActiveToggle}>
            <ToggleButton className={classes.toggle}
                          style={value ? activeButtonStyle : {}}
                          onClick={()=> value === false && onToggle(true)}
                          value={value}>
                פעיל
            </ToggleButton>
            <ToggleButton className={classes.toggle}
                          style={!value ? notActiveButtonStyle : {}}
                          onClick={()=> value === true && onToggle(false)}
                          value={value}>
                לא פעיל
            </ToggleButton>
        </ToggleButtonGroup>
    )
});

interface Props extends ToggleButtonGroupProps {
    onToggle: (isActive: boolean) => void;
}
export default IsActiveToggle;
