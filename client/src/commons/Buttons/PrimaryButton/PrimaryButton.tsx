import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

import useStyles from './PrimaryButtonStyles';

type sizes = 'regular' |'custom';
interface Props extends ButtonProps {
    children: any;
    width?: sizes;
    background?: string;
}

const PrimaryButton: React.FC<Props> = (props: Props): JSX.Element => {
    const { children, width='regular',background, ...rest } = props;
    const styles = useStyles(background)({});
    const classes = [styles.button];
    const appendedClasses = width === 'regular' ? classes.concat(styles.regular) : classes;

    return (
        <Button 
            {...rest}
            variant='contained'
            color={background ? 'inherit' : 'primary'}
            className={appendedClasses.join(' ')}>
            {children}
        </Button>
    )
}

export default PrimaryButton;
