import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/InvestigationInfo/mockSelectors';
import MockCommentContextProvider from 'Utils/Testing/InvestigationInfo/MockCommentContextProvider';

import InvestigationMenu, { existingCommentColor, noCommentsColor } from './InvestigationMenu';

const comment = 'הערה';
const setComment = jest.fn();
const props = {
    comment,
    setComment
}

describe('<InvestigationMenu />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider >
            <MockCommentContextProvider {...props}>
                <InvestigationMenu />
            </MockCommentContextProvider>
        </MockThemeProvider>
    )

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('doesnt show icon' , () => {
        const commentIcon = wrapper.find(CommentIcon);
        
        expect(commentIcon.exists()).toBeTruthy();
        expect(commentIcon.getDOMNode()).not.toBeVisible();
    });

    describe('after menu click: ', () => {
        const investigationButton = wrapper.find('button#investigationInfo-menu-button');
        beforeAll(() => {
            act(() => {
                investigationButton.simulate('click');
            });
            wrapper.update();
        });

        it('shows comment icon', () => {
            const commentIcon = wrapper.find(CommentIcon);
    
            expect(commentIcon.exists()).toBeTruthy();
            expect(wrapper.find(CommentIcon).getDOMNode()).toBeVisible();
        });
        
       
        it('shows comment', () => {
            const commentText = wrapper.find('p#investigation-comment');

            expect(commentText.exists()).toBeTruthy();
            expect(commentText.text()).toBe('הערות על החקירה');
        }); 
    });

    describe('CommentIcon :', () => {
        it('shows color when existing comment', () => {
            const commentIcon = wrapper.find(CommentIcon);

            expect(commentIcon.exists()).toBeTruthy();
            expect(commentIcon.props().htmlColor).toBe(existingCommentColor);
        });

        it('shows color when no comment exists', () => {
            const noCommentWrapper = mount(
                <MockThemeProvider >
                    <MockCommentContextProvider {...props} comment={''}>
                        <InvestigationMenu />
                    </MockCommentContextProvider>
                </MockThemeProvider>       
            )
            const commentIcon = noCommentWrapper.find(CommentIcon);

            expect(commentIcon.exists()).toBeTruthy();
            expect(commentIcon.props().htmlColor).toBe(noCommentsColor);
        });
    })
    
})
