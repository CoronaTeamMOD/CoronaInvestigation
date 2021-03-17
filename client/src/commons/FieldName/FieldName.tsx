import React from 'react';
import {Grid, GridSize, Typography, TypographyProps} from '@material-ui/core';
import useFormStyles from 'styles/formStyles';

interface Props extends Partial<TypographyProps>{
    fieldName: string;
    appendantLabelIcon?: JSX.Element;
    xs?: GridSize;
}

const FieldName = ({fieldName, xs, className, appendantLabelIcon, ...typographyProps}: Props) => {
    const classes = useFormStyles();
    const defaultGridXSSize = 3;

    return (
        <Grid item xs={xs || defaultGridXSSize} {...className && {className}}>
            <Typography className={classes.fontSize15} {...typographyProps}>
                    {fieldName}
            </Typography>
            {appendantLabelIcon}
        </Grid>
    );
};

export default FieldName;