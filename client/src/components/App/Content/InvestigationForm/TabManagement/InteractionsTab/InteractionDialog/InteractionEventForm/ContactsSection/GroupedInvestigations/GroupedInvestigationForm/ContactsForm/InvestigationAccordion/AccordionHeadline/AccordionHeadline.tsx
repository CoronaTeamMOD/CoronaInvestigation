import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AccordionSummary, Typography } from '@material-ui/core';

import useStyles from './accordionHeadlineStyles';

interface Props {
    epidemiologyNumber : number;
    identityNumber: string;
    fullName : string;
}

const AccordionHeadline = (props: Props) => {
    const {epidemiologyNumber, identityNumber, fullName} = props;

    const classes = useStyles();

    return (
        <AccordionSummary
            className={classes.header}
            expandIcon={<ExpandMoreIcon />}
            id={`accordion-${epidemiologyNumber}`}
        >
         <Typography variant='h5'>{`${fullName}, ${epidemiologyNumber}, ${identityNumber}`}</Typography>   
        </AccordionSummary>
    )
}

export default AccordionHeadline
