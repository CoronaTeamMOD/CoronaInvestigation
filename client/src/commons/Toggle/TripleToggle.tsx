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
    };

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton 
                className={classes.trippleToggle} 
                disabled={disabled}
                style={value === firstOption?.id ? activeButtonStyle : {}}
                value={firstOption?.id}>
                {firstOption?.displayName}
            </ToggleButton>
            <ToggleButton 
                className={classes.trippleToggle}
                disabled={disabled}
                style={value === secondOption?.id ? activeButtonStyle : {}}
                value={secondOption?.id}>
                {secondOption?.displayName}
            </ToggleButton>
            <ToggleButton 
                className={classes.trippleToggle} 
                disabled={disabled}
                style={value === thirdOption?.id ? activeButtonStyle : {}}
                value={thirdOption?.id}>
                {thirdOption?.displayName}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default TrippleToggle;

interface Option {
    displayName: string;
    id: number;
};

interface Props extends ToggleButtonGroupProps {
    firstOption?: Option;
    secondOption?: Option;
    thirdOption?: Option;
    disabled?: boolean;
    value?: number;
};