import { string } from "yup"

export enum UsersManagementTableHeadersNames {
    FULL_NAME = 'fullName',
    SOURCE_ORGANIZATION = 'sourceOrganization',
    LANGUAGES = 'languages',
    MABAR_USER_NAME = 'id',
    COUNTY = 'investigationGroup',
    DESK = 'desk',
    USER_TYPE = 'userType',
    USER_STATUS = 'isActive',
    WATCH = 'watch'
}

export const UsersManagementTableHeaders = {
    [UsersManagementTableHeadersNames.FULL_NAME]: 'שם',
    [UsersManagementTableHeadersNames.SOURCE_ORGANIZATION]: 'מסגרת',
    [UsersManagementTableHeadersNames.LANGUAGES]: 'שפות מדוברות',
    [UsersManagementTableHeadersNames.MABAR_USER_NAME]: 'שם משתמש',
    [UsersManagementTableHeadersNames.COUNTY]: 'נפה',
    [UsersManagementTableHeadersNames.DESK]: 'דסק',
    [UsersManagementTableHeadersNames.USER_TYPE]: 'סוג משתמש',
    [UsersManagementTableHeadersNames.USER_STATUS]: 'פעיל/לא פעיל',
    [UsersManagementTableHeadersNames.WATCH]: ''
}

export const SortOrderTableHeadersNames = {
    [UsersManagementTableHeadersNames.FULL_NAME]: 'FULL_NAME',
    [UsersManagementTableHeadersNames.SOURCE_ORGANIZATION]: 'SOURCE_ORGANIZATION',
    [UsersManagementTableHeadersNames.MABAR_USER_NAME]: 'ID',
    [UsersManagementTableHeadersNames.COUNTY]: 'INVESTIGATION_GROUP',
    [UsersManagementTableHeadersNames.USER_TYPE]: 'USER_TYPE',
    [UsersManagementTableHeadersNames.USER_STATUS]: 'IS_ACTIVE',
}
