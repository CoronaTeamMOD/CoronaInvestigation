import React from 'react';
import { Button, ButtonProps, Typography } from '@material-ui/core';

import useStyles from './investigationInfoButtonStyles';

const InvestigationInfoButton: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { amountOfInvestigations, text,  ...rest } = props;

    return (
        <>
            <Button
                {...rest}
                className={classes.button}
                variant='contained'
                size='large'
            >
                <div>
                    <Typography className={classes.amountOfInvestigations}><b>{amountOfInvestigations}</b></Typography>
                    <Typography className={classes.text}><b>{text}</b></Typography>
                </div>
            </Button>
        </>
    )
}

export default InvestigationInfoButton;

interface Props extends ButtonProps {
    amountOfInvestigations: number;
    text: string;
};
