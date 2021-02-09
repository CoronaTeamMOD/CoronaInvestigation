import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MockRouter from 'Utils/Testing/MockRouter';
import desks from 'Utils/Testing/AdminLandingPage/state/desks';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import mockSelectors from 'Utils/Testing/AdminLandingPage/mockSelectors';

import DesksFilterCard from './desksFilterCard';
import LoadingCard from '../LoadingCard/LoadingCard';

const onUpdateButtonClicked = jest.fn();

const mockedLocationState = {
    deskFilter : [2]
}

describe('<DesksFilterCard />', () => {
    mockSelectors();
    const wrapper = mount(
        <MockThemeProvider>
            <MockRouter>
                <DesksFilterCard 
                    onUpdateButtonClicked={onUpdateButtonClicked}
                />
            </MockRouter>
        </MockThemeProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('is not loading' , () => {
        const loadingCard = wrapper.find(LoadingCard);

        expect(loadingCard.props().isLoading).toBeFalsy();
    });

    it('shows headline' , () => {
        const headline = wrapper.find('h6#desks-card-headline');

        expect(headline.exists()).toBeTruthy();
        expect(headline).toHaveLength(1);
        expect(headline.text()).toBe('הדסקים בהם הינך צופה');
    });

    describe('clear all desks checkbox' , () => {
        const allDesksCheckbox = wrapper.find('input#all-desks-checkbox')
        it('renders', () => {
            expect(allDesksCheckbox.exists()).toBeTruthy();
            expect(allDesksCheckbox).toHaveLength(1);
        });

        it('clears all desks choices' , () => {
            let deskCheckbox = wrapper.find('input#desk-checkbox-1');
            
            expect(deskCheckbox.exists()).toBeTruthy();
            expect(deskCheckbox.props().checked).toBeFalsy();

            act(() => {
                deskCheckbox.simulate('change');
            })
            wrapper.update();

            deskCheckbox = wrapper.find('input#desk-checkbox-1');
            expect(deskCheckbox.props().checked).toBeTruthy();

            act(() => {
                allDesksCheckbox.simulate('change');
            });
            wrapper.update();

            deskCheckbox = wrapper.find('input#desk-checkbox-1');
            expect(deskCheckbox.props().checked).toBeFalsy()
        });
    });

    describe('desks checkbox' , () => {
        const desksWrapper = wrapper.find('div#desks-wrapper');
        const labels = desksWrapper.find('label.MuiFormControlLabel-root');
        it('renders', () => {
            expect(desksWrapper.exists()).toBeTruthy();

            expect(labels).toHaveLength(2);
        });

        it('doesnt show out of county desk' , () => {
            const outOfGroupCountyId = `input#desk-checkbox-${desks[2].id}`;
            
            expect(wrapper.find(outOfGroupCountyId).exists()).toBeFalsy();
        });
        
        it('click box functiontality', () => {
            const firstDeskId = `input#desk-checkbox-${desks[0].id}`;
            let firstDeskInput = wrapper.find(firstDeskId);

            expect(firstDeskInput.exists()).toBeTruthy();
            expect(firstDeskInput.props().checked).toBeFalsy();

            act(() => {
                firstDeskInput.simulate('change');
            });
            wrapper.update();

            firstDeskInput = wrapper.find(firstDeskId);
            expect(firstDeskInput.props().checked).toBeTruthy();
        });
    })

    describe('updateButton' , () => {
        it.todo('renders');

        it.todo('calls click with correct info');
    })

    it.todo('existing history')
});
