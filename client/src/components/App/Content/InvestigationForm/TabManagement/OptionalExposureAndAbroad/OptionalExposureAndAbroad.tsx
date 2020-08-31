import React from 'react';
import useStyles from './OptionalExposureAndAbroadStyles';

const OptionalExposureAndAbroad: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    return (
        <div className={classes.root}>
            <div className={classes.abroadPanel}>

            </div>

            <div className={classes.optionalExposurePanel}>

            </div>
        </div>

    )
};

export default OptionalExposureAndAbroad;
