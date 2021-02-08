import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Pagination } from '@material-ui/lab';

import UserType from 'models/enums/UserType';
import MockThemeProvider from 'Utils/Testing/MockThemeProvider';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import mockSelectors from 'Utils/Testing/UsersManagement/mockSelectors';

import UserInfoDialog from './UserInfoDialog/UserInfoDialog';
import EditUserInfoDialog from './EditUserInfoDialog/EditUserInfoDialog';
import { UsersManagementTableHeaders } from './UsersManagementTableHeaders';
import UsersManagement , { usersManagementTitle, notActiveSortFields } from './UsersManagement';


describe('<UsersManagement />', () => {
    mockSelectors(UserType.ADMIN);
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
        beforeEach(() => {
            jest.clearAllMocks();
        })
        afterAll(() => {
            jest.clearAllMocks();
        })

        it('doesnt show for investigaitor' , () => {
            mockSelectors(UserType.INVESTIGATOR);
            const deactivateWrapper = mount(
                <MockThemeProvider>
                    <UsersManagement />
                </MockThemeProvider>
            );

            const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');

            expect(deactivteButton.exists()).toBeFalsy();
        });

        it('shows for admin' , () => {
            mockSelectors(UserType.ADMIN);
            const deactivateWrapper = mount(
                <MockThemeProvider>
                    <UsersManagement />
                </MockThemeProvider>
            );

            const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');

            expect(deactivteButton.exists()).toBeTruthy();
        });

        it('doesnt show for investigaitor' , () => {
            mockSelectors(UserType.INVESTIGATOR);
            const deactivateWrapper = mount(
                <MockThemeProvider>
                    <UsersManagement />
                </MockThemeProvider>
            );

            const deactivteButton = deactivateWrapper.find('button#deactivate-all-users-button');

            expect(deactivteButton.exists()).toBeFalsy();
        });
    });
});
