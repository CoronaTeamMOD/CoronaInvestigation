import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const Toggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { firstOption, secondOption, className, value, ...rest } = props;

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton className={classes.toggle} value={false} style={value ? { backgroundColor: '' } : { backgroundColor: theme.palette.primary.main, color: 'white' }}>
                {firstOption ? firstOption : 'לא'}
                                </ToggleButton>
            <ToggleButton className={classes.toggle} value={true} style={value ? { backgroundColor: theme.palette.primary.main, color: 'white' } : { backgroundColor: '' }}>
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
