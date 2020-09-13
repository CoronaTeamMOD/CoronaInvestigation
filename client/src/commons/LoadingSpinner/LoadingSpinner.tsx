import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Backdrop } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';

import useStyle from './LoadingSpinnerStyles';

const LoadingSpinner: React.FC = () => {

    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);

    const classes = useStyle();

    return (
      <Backdrop open={isLoading} className={classes.container}>
        <CircularProgress size="20vh" />
      </Backdrop>
    );
}

export default LoadingSpinner;