import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import { useStyles } from './ToggleStyles';
import theme from 'styles/theme';

const Toggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { firstOption, secondOption, value, ...rest } = props;
    const activeButtonStyle = {
        backgroundColor: theme.palette.primary.main, 
        color: 'white'
    }

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton className={classes.toggle} 
                style={!value ? activeButtonStyle : {}}
                value={false}>
                {firstOption ? firstOption : 'לא'}
            </ToggleButton>
            <ToggleButton className={classes.toggle}
                style={value ? activeButtonStyle : {}}
                value={true}>
                {secondOption ? secondOption : 'כן'}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default Toggle;

interface Props extends ToggleButtonGroupProps {
    firstOption?: string;
    secondOption?: string;
};
