import React from 'react';

import useStyles from './ContentStyles';
import TabManagement from './TabManagement/TabManagement';

const Content: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <div className={classes.content}>
            <TabManagement></TabManagement>
        </div>
    )
}

export default Content;
