import React from 'react';
import axios from 'axios';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import CommentDialog from './CommentDialog';
import axiosMock from 'Utils/Testing/axiosMock';
import flushPromises from 'Utils/Testing/flushPromises';
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

const textfieldSelector = 'TypePreventiveTextField[name="comment"]';

axiosMock.onPost('/investigationInfo/comment').reply(200);

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

    it('shows dialog title', () => {
        const title = wrapper.find('span#comment-dialog-title-text');

        expect(title.exists()).toBeTruthy();
        expect(title.text()).toBe('הוספת הערה על חקירה:');
    });

    describe('input :', () => {
        const testQuery = 'test';
        mockSelectors();
        const wrapper = mount(
            <MockThemeProvider>
                <MockCommentContextProvider {...commentProps}>
                    <CommentDialog {...props}/>
                </MockCommentContextProvider>
            </MockThemeProvider>
        )
        
        it('renders', () => {
            expect(wrapper.find(textfieldSelector).exists()).toBeTruthy();
        });

        it('changes query value accordingly' , () => {
            expect(wrapper.find(textfieldSelector).props().value).toBe(comment);

            changeQuery(wrapper, testQuery);

            expect(wrapper.find(textfieldSelector).props().value).toBe(testQuery);
        });
    });

    describe('save button: ', () => {
        const testQuery = 'test';
        mockSelectors();
        const wrapper = mount(
            <MockThemeProvider>
                <MockCommentContextProvider {...commentProps}>
                    <CommentDialog {...props}/>
                </MockCommentContextProvider>
            </MockThemeProvider>
        )
        const saveButtonSelector = 'button#comment-dialog-save';

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('renders' , () => {
            expect(wrapper.find(saveButtonSelector).exists()).toBeTruthy();
        });

        it('is disabled on first', () => {
            expect(wrapper.find(saveButtonSelector).prop('disabled')).toBeTruthy();
        });

        it('undisables on query change' , () => {
            changeQuery(wrapper , testQuery);

            expect(wrapper.find(saveButtonSelector).prop('disabled')).toBeFalsy();
        });

        it('disables when new comment is equal to old comment', () => {
            changeQuery(wrapper , comment);

            expect(wrapper.find(saveButtonSelector).prop('disabled')).toBeTruthy();
        });

        it('clicks' , async () => {
            changeQuery(wrapper , testQuery);
            const axiosSpy = jest.spyOn(axios , 'post');
            expect(axiosSpy).not.toHaveBeenCalled();
            expect(handleDialogClose).not.toHaveBeenCalled();

            act(() => {
                wrapper.find(saveButtonSelector).simulate('click');
            });
            await flushPromises();

            expect(axiosSpy).toHaveBeenCalled();
            expect(axiosSpy).toHaveBeenCalledWith("/investigationInfo/comment" , {comment : testQuery , epidemiologyNumber : 555});
            expect(handleDialogClose).toHaveBeenCalled();
        });
    });

    describe('delete button' , () => {
        mockSelectors();
        const wrapper = mount(
            <MockThemeProvider>
                <MockCommentContextProvider {...commentProps}>
                    <CommentDialog {...props}/>
                </MockCommentContextProvider>
            </MockThemeProvider>
        )
        const deleteButton = wrapper.find('button#comment-dialog-delete');
        
        it('renders' , () => {
            expect(deleteButton.exists()).toBeTruthy();
        });

        it('clicks' , async () => {
            const axiosSpy = jest.spyOn(axios , 'post');
            expect(axiosSpy).not.toHaveBeenCalled();
            expect(handleDialogClose).not.toHaveBeenCalled();
            
            act(() => {
                deleteButton.simulate('click');
            });
            await flushPromises();

            expect(axiosSpy).toHaveBeenCalled();
            expect(axiosSpy).toHaveBeenCalledWith("/investigationInfo/comment" , {comment : null , epidemiologyNumber : 555});
            expect(handleDialogClose).toHaveBeenCalled();
        });
    });
});

const changeQuery = ( wrapper : any , query : string ) => {
    act(() => {
        //@ts-ignore
        wrapper.find(textfieldSelector).props().onChange(query);
    });
    wrapper.update();
}
