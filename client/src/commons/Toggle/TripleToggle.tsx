import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const TrippleToggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { firstOption, secondOption, thirdOption, value, disabled, ...rest } = props;
    const activeButtonStyle = {
        backgroundColor: theme.palette.primary.main, 
        color: 'white'
    }

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton className={classes.toggle} 
                disabled={disabled}
                style={value === 2 ? activeButtonStyle : {}}
                value={2}>
                {firstOption}
            </ToggleButton>
            <ToggleButton className={classes.toggle}
                disabled={disabled}
                style={value === 3 ? activeButtonStyle : {}}
                value={3}>
                {secondOption}
            </ToggleButton>
            <ToggleButton className={classes.toggle} 
                disabled={disabled}
                style={value === 4 ? activeButtonStyle : {}}
                value={4}>
                {thirdOption}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default TrippleToggle;

interface Props extends ToggleButtonGroupProps {
    firstOption?: string;
    secondOption?: string;
    thirdOption?: string;
    disabled?: boolean;
    value?: number;
};