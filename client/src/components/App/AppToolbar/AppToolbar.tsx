import React from 'react';

import useStyles from './AppToolbarStyles';
import TopToolbar from './TopToolbar/TopToolbar';

const AppToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <div className={classes.appToolbar}>
            <TopToolbar/>
        </div>
    )
}

export default AppToolbar;
