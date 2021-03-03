import authorityReducer from "redux/Authority/authorityReducer";

export enum UsersManagementTableHeadersNames {
    FULL_NAME = 'fullName',
    USER_NAME = 'userName',
    SOURCE_ORGANIZATION = 'sourceOrganization',
    AUTHORITY  = 'authority',
    LANGUAGES = 'languages',
    MABAR_USER_NAME = 'id',
    COUNTY = 'investigationGroup',
    DESK = 'desk',
    USER_TYPE = 'userType',
    USER_STATUS = 'isActive',
    WATCH = 'watch',
    EDIT = 'edit'
};

export const UsersManagementTableHeaders = {
    [UsersManagementTableHeadersNames.USER_NAME]: 'שם',
    [UsersManagementTableHeadersNames.SOURCE_ORGANIZATION]: 'מסגרת',
    [UsersManagementTableHeadersNames.AUTHORITY]: 'שם הרשות',
    [UsersManagementTableHeadersNames.LANGUAGES]: 'שפות מדוברות',
    [UsersManagementTableHeadersNames.MABAR_USER_NAME]: 'מזהה',
    [UsersManagementTableHeadersNames.COUNTY]: 'נפה',
    [UsersManagementTableHeadersNames.DESK]: 'דסק',
    [UsersManagementTableHeadersNames.USER_TYPE]: 'סוג משתמש',
    [UsersManagementTableHeadersNames.USER_STATUS]: 'פעיל/לא פעיל',
    [UsersManagementTableHeadersNames.WATCH]: '',
    [UsersManagementTableHeadersNames.EDIT]: ''
};

export const SortOrderTableHeadersNames = {
    [UsersManagementTableHeadersNames.USER_NAME]: 'USER_NAME',
    [UsersManagementTableHeadersNames.SOURCE_ORGANIZATION]: 'SOURCE_ORGANIZATION',
    [UsersManagementTableHeadersNames.MABAR_USER_NAME]: 'ID',
    [UsersManagementTableHeadersNames.COUNTY]: 'INVESTIGATION_GROUP',
    [UsersManagementTableHeadersNames.USER_TYPE]: 'USER_TYPE',
    [UsersManagementTableHeadersNames.USER_STATUS]: 'IS_ACTIVE',
};