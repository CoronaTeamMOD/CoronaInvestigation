import React from 'react';
import {Grid, GridItemsAlignment, GridProps, GridSize, GridSpacing} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FieldName from '../FieldName/FieldName';

interface FormRowWithInputProps {
    fieldName: string;
    appendantLabelIcon?: JSX.Element;
    children: React.ReactElement;
    testId?: string;
    xs?: GridSize;
    gridProps?: GridProps;
}

const defaultGridProps = {
    alignItems: 'center' as GridItemsAlignment,
    spacing: 3 as GridSpacing,
};

const FormRowWithInput = ({fieldName, children, testId, xs, gridProps, appendantLabelIcon}: FormRowWithInputProps) => {
    const classes = useFormStyles();
    return (
        <Grid container test-id={testId} className={classes.containerGrid}
              {...{...defaultGridProps, ...gridProps}}>
            <FieldName xs={xs} fieldName={fieldName} className={classes.fieldContainer} appendantLabelIcon={appendantLabelIcon}/>
            {children}
        </Grid>
    );
};

export default FormRowWithInput;
