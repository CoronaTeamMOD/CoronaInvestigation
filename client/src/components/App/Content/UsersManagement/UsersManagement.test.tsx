import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { Pagination } from '@material-ui/lab';

import UserTypeCodes from 'models/enums/UserTypeCodes';
import flushPromises from 'Utils/Testing/flushPromises';
import { user } from 'Utils/Testing/UsersManagement/state';
import { confirmed , dismissed } from 'Utils/Testing/MockSwal';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import mockSelectors from 'Utils/Testing/UsersManagement/mockSelectors';

import UserInfoDialog from './UserInfoDialog/UserInfoDialog';
import EditUserInfoDialog from './EditUserInfoDialog/EditUserInfoDialog';
import { UsersManagementTableHeaders } from './UsersManagementTableHeaders';
import UsersManagement , { usersManagementTitle, notActiveSortFields } from './UsersManagement';

const mockAxios = new MockAdapter(axios);

describe('<UsersManagement />', () => {
    mockSelectors(UserTypeCodes.ADMIN);
    const wrapper = mount(
        <MockThemeProvider>
            <UsersManagement />
        </MockThemeProvider>
    )

    it('renders' , () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    it('shows headline', () => {
        const headline = wrapper.find('p#user-management-title');
        
        expect(headline.exists()).toBeTruthy();
        expect(headline).toHaveLength(1);
        expect(headline.text()).toBe(usersManagementTitle);
    });

    it('shows filter button' , () => {
        const filterButton = wrapper.find('button#filterButton');

        expect(filterButton.exists()).toBeTruthy();
    });

    it('toggles filter collapse', () => {
        const filtersCollapse = wrapper.find('div#filters-collapse');

        expect(filtersCollapse.exists()).toBeTruthy();
        expect(filtersCollapse.getDOMNode()).not.toBeVisible();
        act(() => {
            wrapper.find('button#filterButton').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find('div#filters-collapse').getDOMNode()).toBeVisible();
    });

    it('shows users table' , () => {
        const userTable = wrapper.find('table#users-table');

        expect(userTable.exists()).toBeTruthy();
        expect(userTable).toHaveLength(1);
    });

    it('shows table header' , () => {
        const tableHeader = wrapper.find('thead#users-table-header');

        expect(tableHeader.exists()).toBeTruthy();
        expect(tableHeader).toHaveLength(1);
    });

    describe('table headers: ' , () => {
        const tableHeaders = wrapper.find('thead#users-table-header');
        const columns = Object.keys(UsersManagementTableHeaders);

        columns.forEach(column => {
            describe(`${column}: `, () => {
                const currentTableCell = tableHeaders.find(`th#table-header-${column} span`);

                it('shows text' , () => {
                    expect(currentTableCell.text()).toBe(get(UsersManagementTableHeaders, column));
                });
    
                const isSortable = !notActiveSortFields.includes(column);
                const sortableTestName =  isSortable ? 'has sort icon': 'doesnt have sort icon';
                it(sortableTestName , () => {
                    const sortIcon = currentTableCell.find('svg');
    
                    isSortable
                        ? expect(sortIcon.exists()).toBeTruthy()
                        : expect(sortIcon.exists()).toBeFalsy();
                });
            });
        });
    });

    it('shows paginaion' , () => {
        const paginaion = wrapper.find(Pagination);

        expect(paginaion.exists()).toBeTruthy();
        expect(paginaion).toHaveLength(1);
    });

    it('doesnt show userInfo dialog' , () => {
        const userInfoDialog = wrapper.find(UserInfoDialog);

        expect(userInfoDialog.exists()).toBeTruthy();
        expect(userInfoDialog.props().open).toBeFalsy();
    });

    it('doesnt show userInfo dialog' , () => {
        const editUserInfoDialog = wrapper.find(EditUserInfoDialog);

        expect(editUserInfoDialog.exists()).toBeTruthy();
        expect(editUserInfoDialog.props().open).toBeFalsy();
    });

    describe('deactivte all users button: ' , () => {
        describe('shows: ', () => {
            beforeEach(() => {
                jest.clearAllMocks();
            })
            afterAll(() => {
                jest.clearAllMocks();
            });

            it('investigaitor' , () => {
                mockSelectors(UserTypeCodes.INVESTIGATOR);
                const deactivateWrapper = mount(
                    <MockThemeProvider>
                        <UsersManagement />
                    </MockThemeProvider>
                );
    
                const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');
    
                expect(deactivteButton.exists()).toBeFalsy();
            });
    
            it('admin' , () => {
                mockSelectors(UserTypeCodes.ADMIN);
                const deactivateWrapper = mount(
                    <MockThemeProvider>
                        <UsersManagement />
                    </MockThemeProvider>
                );
    
                const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');
    
                expect(deactivteButton.exists()).toBeTruthy();
            });

            it('investigaitor' , () => {
                mockSelectors(UserTypeCodes.INVESTIGATOR);
                const deactivateWrapper = mount(
                    <MockThemeProvider>
                        <UsersManagement />
                    </MockThemeProvider>
                );
    
                const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');
    
                expect(deactivteButton.exists()).toBeFalsy();
            });
        });

        describe('clicks', () => {
            const expectedUserCounty = user(UserTypeCodes.ADMIN).displayedCounty;
            let deactivateWrapper : any;

            beforeEach( async () => {
                mockSelectors(UserTypeCodes.ADMIN);
                await act( async () => {
                    deactivateWrapper = mount(
                        <MockThemeProvider>
                            <UsersManagement />
                        </MockThemeProvider>
                    );
                    await flushPromises();
                });
                jest.clearAllMocks();
            });
            afterEach(() => {
                deactivateWrapper.unmount(); 
            });
            afterAll(() => {
                jest.clearAllMocks();
            })

            it('decline' , async () => {
                const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');
                
                const mockWarning = dismissed;
                jest.spyOn(Swal, 'fire').mockImplementation(mockWarning);
                const axiosSpy = jest.spyOn(axios , 'post');

                expect(mockWarning).not.toHaveBeenCalled();
                expect(axiosSpy).not.toHaveBeenCalled();

                await act( async () => {
                    deactivteButton.simulate('click');    
                    await flushPromises();
                });

                expect(mockWarning).toHaveBeenCalled();
                expect(axiosSpy).not.toHaveBeenCalled();
            });

            it('accept' , async () => {
                const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');
                
                const mockWarning = confirmed;
                jest.spyOn(Swal, 'fire').mockImplementation(mockWarning);
                const axiosSpy = jest.spyOn(axios , 'post');

                expect(mockWarning).not.toHaveBeenCalled();
                expect(axiosSpy).not.toHaveBeenCalled();

                await act( async () => {
                    deactivteButton.simulate('click');    
                    await flushPromises();
                });

                expect(mockWarning).toHaveBeenCalled();
                expect(axiosSpy).toHaveBeenCalled();
                expect(axiosSpy).toHaveBeenCalledWith('users/deactivateAllCountyUsers' , { county : expectedUserCounty});
            });
        });
    });
    describe('user managment counter: ' , () => {
        const counter = wrapper.find('p#user-management-counter');
        it('renders' , () => {    
            expect(counter.exists()).toBeTruthy();
        });
        it('shows count' , () => {    
            expect(counter.text()).toBe('סה"כ 0 חוקרים');

        });
    });
    describe('table SearchBar: ' , () => {
        const searchBar = wrapper.find('#user-management-search-bar');
        it('renders' , () => {    
            expect(searchBar.exists()).toBeTruthy();
        });
    })
});
