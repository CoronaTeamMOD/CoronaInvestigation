import React from 'react';
import { Router } from 'react-router-dom';

import { TimeRange } from 'models/TimeRange';

const MockRouter: React.FC<Props> = (props) => {
    const { locationState } = props
    
    const historyMock = {
        push: jest.fn(), 
        location: locationState ?  { state : locationState } : {}, 
        listen: jest.fn(), 
        replace: jest.fn(),
        createHref: jest.fn()
    };

    return (
        //@ts-ignore
        <Router history={historyMock}>
            {props.children}
        </Router>
    )
};

interface Props {
    locationState? : {
        deskFilter? : number[];
        timeRangeFilter? : TimeRange;
    }; 
}

export default MockRouter;
