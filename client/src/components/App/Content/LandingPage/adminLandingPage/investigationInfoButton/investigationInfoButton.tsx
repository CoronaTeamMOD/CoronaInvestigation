import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

import useStyles from './investigationInfoButtonStyles';

const InvestigationInfoButton: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { amountOfInvestigations, text, ...rest } = props;

    return (
        <>
            <Button
                {...rest}
                style={{ color: 'white', height: '9vh', width: '7vw', borderRadius: '0.8vw' }}
                variant='contained'
                size='large'
            >
                {amountOfInvestigations + ' ' + text}
            </Button>
        </>
    )
}

export default InvestigationInfoButton;

interface Props extends ButtonProps {
    amountOfInvestigations: number;
    text: string;
};
