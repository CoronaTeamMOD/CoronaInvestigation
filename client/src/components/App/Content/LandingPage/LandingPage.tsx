import React from 'react';
import {connect} from 'react-redux';
import { Typography } from '@material-ui/core';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

const LandingPage: React.FC<Props> = (props: Props): JSX.Element => {
  
    return (
        <>
            <Typography>עמוד נחיתה</Typography>
            <Typography>{props.user.id}</Typography>
            <Typography>{props.user.name}</Typography>
        </>
    )
}

const mapStateToProps = (state: StoreStateType) => ({
    user: state.user
});

interface Props {
    user: User
}

export default connect(mapStateToProps)(LandingPage);
