import { mount } from 'enzyme';
import { History } from 'history';
import React, { PropsWithChildren } from 'react';
import { Router, BrowserRouter} from 'react-router-dom';

const TestHookComponent = ({ callback }: any) : null => {
    callback();
    return null;
}

export const testHooksFunctionWithRoute = (callback: any, history?: History<History.PoorMansUnknown>): void => {
    const WrappingRouterComponent = (props: PropsWithChildren<any>) =>
        history
            ? <Router history={history}></Router>
            : <BrowserRouter>{props.children}</BrowserRouter>;

    mount(
        <WrappingRouterComponent>
            <TestHookComponent callback={callback}/>
        </WrappingRouterComponent>
    );
};

export const testHooksFunction = (callback: any): void => {
    mount(<TestHookComponent callback={callback}/>);
};
