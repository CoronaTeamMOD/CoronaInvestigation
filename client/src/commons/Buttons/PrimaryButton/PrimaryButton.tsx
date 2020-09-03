import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

import useStyles from './PrimaryButtonStyles';

interface Props extends ButtonProps {
    children: any;
}

const PrimaryButton: React.FC<Props> = (props: Props): JSX.Element => {    
    const classes = useStyles({});

    const { children, ...rest } = props;

    return (
        <Button 
            {...rest}
            variant='contained' 
            color='primary' 
            className={classes.button}>
            {children}
        </Button>
    )
}

export default PrimaryButton;
