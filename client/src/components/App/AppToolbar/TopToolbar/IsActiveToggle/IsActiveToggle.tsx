import React from 'react';
import {ToggleButton} from '@material-ui/lab';
import ToggleButtonGroup, {ToggleButtonGroupProps} from '@material-ui/lab/ToggleButtonGroup';

import useStyles from './IsActiveToggleStyles';

const IsActiveToggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {value, setUserActivityStatus, ...rest} = props;

    const activeButtonStyle = {
        backgroundColor: '#117243',
        color: 'white'
    };

    const notActiveButtonStyle = {
        backgroundColor: '#9e2a2b',
        color: 'white'
    };

    return(
        <ToggleButtonGroup value={value} exclusive className={classes.isActiveToggle} {...rest}>
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
};

interface Props extends ToggleButtonGroupProps {
    setUserActivityStatus: (isActive: boolean) => void;
}
export default IsActiveToggle;
