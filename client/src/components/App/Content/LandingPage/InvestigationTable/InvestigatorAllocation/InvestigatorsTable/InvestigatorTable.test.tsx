import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { investigators } from 'Utils/Testing/InvestigatorAllocation/state/index';
import InvestigatorOption from 'models/InvestigatorOption';

import InvestigatorsTable from './InvestigatorsTable';
import SearchBar from 'commons/SearchBar/SearchBar';

const setSelectedRowSpy = jest.fn();

const contentProps = {
    investigators: investigators.map((investigator: InvestigatorOption) => investigator.value),
    selectedRow: '',
    setSelectedRow: setSelectedRowSpy,
};

describe('<InvestigatorsTable />', () => {
    const wrapper = mount(
        <InvestigatorsTable
            {...contentProps}
        />
    );
    
    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('shows investigators table head' , () => {
        const userTable = wrapper.find('thead#investigators-table-header');
        expect(userTable.exists()).toBeTruthy();
        expect(userTable).toHaveLength(1);
    });

    describe('SearchBar:' , () => {
        const searchBarTextSelector = 'input#search-bar';

        it('renders' , () => {
            expect(wrapper.find(SearchBar).exists()).toBeTruthy();
        });
      
        it('triggers search on user type with no results', () => {
            const event = {
                target: { value: 'חיים' }
            };
            expect(wrapper.find(searchBarTextSelector).at(0).props().value).toBe('');
            act(() => {
                wrapper.find(searchBarTextSelector).simulate('change', event);
            });
            wrapper.update();
            expect(wrapper.find(searchBarTextSelector).at(0).props().value).toBe(event.target.value);
            const tableRow = wrapper.find('tr#investigator-row-206621534');
            expect(tableRow.exists()).toBeFalsy();
        });

        it('triggers search on user type with no results', () => {
            const event = {
                target: { value: 'יוסי' }
            };            
            act(() => {
                wrapper.find(searchBarTextSelector).simulate('change', event);
            });
            wrapper.update();
            expect(wrapper.find(searchBarTextSelector).at(0).props().value).toBe(event.target.value);
            const tableRow = wrapper.find('tr#investigator-row-206621534');
            expect(tableRow.exists()).toBeTruthy();
        });
    });
});