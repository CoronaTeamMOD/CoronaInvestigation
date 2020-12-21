import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const defaultFirstOption : Option = { name: 'לא', value:false };
const defaultSecondOption : Option = { name: 'כן', value:true };

const Toggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { firstOption, secondOption, value, disabled, ...rest } = props;
    const activeButtonStyle = {
        backgroundColor: theme.palette.primary.main, 
        color: 'white'
    }

    const chosenFirstOption = firstOption || defaultFirstOption;
    const chosenSecondOption = secondOption || defaultSecondOption;

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton className={classes.toggle} 
                disabled={disabled}
                style={value === chosenFirstOption.value ? activeButtonStyle : {}}
                value={chosenFirstOption.value}>
                {chosenFirstOption.name}
            </ToggleButton>
            <ToggleButton className={classes.toggle}
                disabled={disabled}
                style={value === chosenSecondOption.value ? activeButtonStyle : {}}
                value={chosenSecondOption.value}>
                {chosenSecondOption.name}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default Toggle;

interface Props extends ToggleButtonGroupProps {
    firstOption?: Option;
    secondOption?: Option;
    disabled?: boolean;
};

interface Option {
    name: string,
    value: any
}
