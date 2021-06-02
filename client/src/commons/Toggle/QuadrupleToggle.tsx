import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const QuadrupleToggle: React.FC<Props> = (props: Props): JSX.Element => {

    const classes = useStyles({});

    const { firstOption, secondOption, thirdOption, fourthOption, value, disabled, ...rest } = props;

    const activeButtonStyle = {
        backgroundColor: theme.palette.primary.main, 
        color: 'white'
    };

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton 
                className={classes.quadrupleToggle} 
                disabled={disabled}
                style={value === firstOption?.id ? activeButtonStyle : {}}
                value={firstOption?.id}>
                {firstOption?.displayName}
            </ToggleButton>
            <ToggleButton 
                className={classes.quadrupleToggle}
                disabled={disabled}
                style={value === secondOption?.id ? activeButtonStyle : {}}
                value={secondOption?.id}>
                {secondOption?.displayName}
            </ToggleButton>
            <ToggleButton 
                className={classes.quadrupleToggle} 
                disabled={disabled}
                style={value === thirdOption?.id ? activeButtonStyle : {}}
                value={thirdOption?.id}>
                {thirdOption?.displayName}
            </ToggleButton>
            <ToggleButton 
                className={classes.quadrupleToggle} 
                disabled={disabled}
                style={value === fourthOption?.id ? activeButtonStyle : {}}
                value={fourthOption?.id}>
                {fourthOption?.displayName}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default QuadrupleToggle;

interface Option {
    displayName: string;
    id: number;
};

interface Props extends ToggleButtonGroupProps {
    firstOption?: Option;
    secondOption?: Option;
    thirdOption?: Option;
    fourthOption?: Option;
    disabled?: boolean;
    value?: number;
};