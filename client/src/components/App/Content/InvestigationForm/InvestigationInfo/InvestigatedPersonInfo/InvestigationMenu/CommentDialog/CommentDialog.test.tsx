import React from 'react'
import { mount } from 'enzyme';

import CommentDialog from './CommentDialog';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/InvestigationInfo/mockSelectors';
import MockCommentContextProvider from 'Utils/Testing/InvestigationInfo/MockCommentContextProvider';

const handleDialogClose = jest.fn();
const props = {
    open : true,
    handleDialogClose
};

const comment = 'הערה';
const setComment = jest.fn();
const commentProps = {
    comment,
    setComment
}

describe('<CommentDialog />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider>
            <MockCommentContextProvider {...commentProps}>
                <CommentDialog {...props}/>
            </MockCommentContextProvider>
        </MockThemeProvider>
    )
    
    it('renders', () => {
        expect(wrapper.exists).toBeTruthy();
    });
})
