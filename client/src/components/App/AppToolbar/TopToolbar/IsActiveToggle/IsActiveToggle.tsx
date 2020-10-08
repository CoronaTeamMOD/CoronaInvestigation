import React from 'react';
import {ToggleButton} from '@material-ui/lab';
import ToggleButtonGroup, {ToggleButtonGroupProps} from '@material-ui/lab/ToggleButtonGroup';

import useStyles from './IsActiveToggleStyles';
import { useTheme } from '@material-ui/core';

const IsActiveToggle: React.FC<Props> = React.forwardRef((props: Props, ref): JSX.Element => {
    const classes = useStyles({});
    const {value, setUserActivityStatus, ...rest} = props;
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
        <ToggleButtonGroup ref={ref} value={value} exclusive className={classes.isActiveToggle} {...rest}>
            <ToggleButton className={classes.toggle}
                          style={value ? activeButtonStyle : {}}
                          onClick={()=> setUserActivityStatus(!value)}
                          value={value}>
                פעיל
            </ToggleButton>
            <ToggleButton className={classes.toggle}
                          style={!value ? notActiveButtonStyle : {}}
                          onClick={()=> setUserActivityStatus(!value)}
                          value={value}>
                לא פעיל
            </ToggleButton>
        </ToggleButtonGroup>
    )
});

interface Props extends ToggleButtonGroupProps {
    setUserActivityStatus: (isActive: boolean) => void;
}
export default IsActiveToggle;
