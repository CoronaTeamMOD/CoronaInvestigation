export enum UsersManagementTableHeadersNames {
    FULL_NAME = 'fullName',
    SOURCE_ORGANIZATION = 'sourceOrganization',
    LANGUAGES = 'languages',
    MABAR_USER_NAME = 'id',
    COUNTY = 'investigationGroup',
    USER_TYPE = 'userType',
    USER_STATUS = 'userStatus'
}

export const UsersManagementTableHeaders = {
    [UsersManagementTableHeadersNames.FULL_NAME]: 'שם',
    [UsersManagementTableHeadersNames.SOURCE_ORGANIZATION]: 'מסגרת',
    [UsersManagementTableHeadersNames.LANGUAGES]: 'שפות מדוברות',
    [UsersManagementTableHeadersNames.MABAR_USER_NAME]: 'שם משתמש',
    [UsersManagementTableHeadersNames.COUNTY]: 'נפה',
    [UsersManagementTableHeadersNames.USER_TYPE]: 'סוג משתמש',
    [UsersManagementTableHeadersNames.USER_STATUS]: 'פעיל/לא פעיל',
}
