import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import theme from 'styles/theme';

import { useStyles } from './ToggleStyles';

const Toggle: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { toggleValue, toggleChangeFunc, firstOption, secondOption } = props;

    return (
        <ToggleButtonGroup value={toggleValue} exclusive onChange={toggleChangeFunc}>
            <ToggleButton className={classes.toggle} value={false} style={toggleValue ? { backgroundColor: '' } : { backgroundColor: theme.palette.primary.main, color: 'white' }}>
                {firstOption ? firstOption : 'לא'}
                                </ToggleButton>
            <ToggleButton className={classes.toggle} value={true} style={toggleValue ? { backgroundColor: theme.palette.primary.main, color: 'white' } : { backgroundColor: '' }}>
                {secondOption ? secondOption : 'כן'}
                                </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default Toggle;

interface Props {
    toggleValue: boolean;
    toggleChangeFunc: (event: React.ChangeEvent<{}>, value: boolean) => void;
    firstOption?: string;
    secondOption?: string;
};
