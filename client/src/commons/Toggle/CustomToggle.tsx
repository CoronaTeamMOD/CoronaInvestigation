import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const CustomToggle: React.FC<Props> = (props: Props): JSX.Element => {

    const classes = useStyles({});

    const { options, value, disabled, ...rest } = props;

    const activeButtonStyle = {
        backgroundColor: theme.palette.primary.main, 
        color: 'white'
    };

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            {options.map((option) => { 
                return(
                <ToggleButton 
                    key={option?.id}
                    className={classes.trippleToggle} 
                    disabled={disabled}
                    style={value === option?.id ? activeButtonStyle : {}}
                    value={option?.id}>
                    {option?.displayName}
                </ToggleButton>
                )
            })}
        </ToggleButtonGroup>
    );
};

export default CustomToggle;

interface Option {
    displayName: string;
    id: number;
};

interface Props extends ToggleButtonGroupProps {
    options: Option[];
    disabled?: boolean;
    value?: number;
};