import React from 'react';
import {connect} from 'react-redux';
import { Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import useStyles from './TopToolbarStyles';
import StoreStateType from 'redux/storeStateType';

const TopToolbar: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <Toolbar className={classes.toolbar}>
            <div className={classes.rightToolbarSection}>
                <img alt='logo' className={classes.logo} src='./assets/img/logo.png'></img>
                <Typography variant='h4'><div className={classes.systemName}>שם המערכת</div></Typography>
            </div>
            <Typography>שלום, {props.userName}</Typography>
        </Toolbar>
    )
}

const mapStateToProps = (state: StoreStateType) => ({
    userName: state.user.name
});

interface Props {
    userName: string
}

export default connect(mapStateToProps)(TopToolbar);
