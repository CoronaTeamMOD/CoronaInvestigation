import React from 'react';
import { Router } from 'react-router-dom';

const MockRouter: React.FC<Props> = (props) => {
    const historyMock = { 
        push: jest.fn(), 
        location: {}, 
        listen: jest.fn(), 
        replace: jest.fn() 
    };

    return (
        //@ts-ignore
        <Router history={historyMock}>
            {props.children}
        </Router>
    )
};

interface Props {}

export default MockRouter;
