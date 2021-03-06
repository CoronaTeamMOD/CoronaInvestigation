import React from 'react';
import {Grid, GridItemsAlignment, GridProps, GridSize, GridSpacing} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FieldName from '../FieldName/FieldName';

interface FormRowWithInputProps {
    className?: string;
    fieldName: string;
    appendantLabelIcon?: JSX.Element;
    children: React.ReactElement;
    testId?: string;
    labelLength?: Exclude<GridSize, 'auto'>;
    gridProps?: GridProps;
}

const defaultGridProps = {
    alignItems: 'center' as GridItemsAlignment,
    spacing: 3 as GridSpacing,
};

const FormRowWithInput = ({fieldName, children, testId, labelLength, gridProps, appendantLabelIcon, className}: FormRowWithInputProps) => {
    const classes = useFormStyles();
    return (
        <Grid container test-id={testId} className={className ? classes.containerGrid.concat(" " + className) : classes.containerGrid}
              {...{...defaultGridProps, ...gridProps}}>
            <FieldName xs={labelLength} fieldName={fieldName} className={classes.fieldContainer} appendantLabelIcon={appendantLabelIcon}/>
            {children}
        </Grid>
    );
};

export default FormRowWithInput;
