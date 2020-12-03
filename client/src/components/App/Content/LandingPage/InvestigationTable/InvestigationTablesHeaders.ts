import SortOrder from 'models/enums/SortOrder';

export const investigatorIdPropertyName = 'investigatorId';

export enum TableHeadersNames {
    multipleCheck = 'multipleCheck',
    epidemiologyNumber = 'epidemiologyNumber',
    coronaTestDate = 'coronaTestDate',
    isComplex = 'isComplex',
    priority = 'priority',
    fullName = 'fullName',
    phoneNumber = 'phoneNumber',
    age = 'age',
    city = 'city',
    county = 'county',
    investigatorName = 'investigatorName',
    investigationStatus = 'investigationStatus',
    investigationSubStatus = 'investigationSubStatus',
    statusReason = 'statusReason',
    investigationDesk = 'investigationDesk',
    comment = 'comment',
    wasInvestigationTransferred = 'wasInvestigationTransferred',
    transferReason = 'transferReason',
    groupId = 'groupId',
    groupReason = 'groupReason',
    canFetchGroup = 'canFetchGroup'
}

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number | boolean };
export interface IndexedInvestigationData extends IndexedInvestigation { [investigatorIdPropertyName]: string; }
export type Order = SortOrder.asc | SortOrder.desc;
export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.multipleCheck]: '',
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידמיולוגי',
    [TableHeadersNames.coronaTestDate]: 'תאריך תחילת המחלה',
    [TableHeadersNames.isComplex]: '',
    [TableHeadersNames.priority]: 'עדיפות',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.phoneNumber]: 'מספר טלפון',
    [TableHeadersNames.age]: 'גיל',
    [TableHeadersNames.city]: '	עיר מגורים',
    [TableHeadersNames.investigatorName]: 'חוקר מבצע',
    [TableHeadersNames.county]: 'נפה מבצעת',
    [TableHeadersNames.investigationStatus]: 'סטטוס ביצוע',
    [TableHeadersNames.investigationSubStatus]: 'סטסטוס ביצוע - מידע נוסף',
    [TableHeadersNames.statusReason]: 'סיבה לסטטוס בטיפול',
    [TableHeadersNames.investigationDesk]: 'דסק מבצע',
    [TableHeadersNames.comment]: ' ',
    [TableHeadersNames.statusReason]: '',
    [TableHeadersNames.wasInvestigationTransferred]: '',
    [TableHeadersNames.transferReason]: '',
    [TableHeadersNames.groupId]: '',
    [TableHeadersNames.canFetchGroup]: '',
    [TableHeadersNames.groupReason]: '',
}

export const adminCols: string[] = [
    TableHeadersNames.multipleCheck,
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.priority,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.investigatorName,
    TableHeadersNames.county,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
]

export const userCols: string[] = [
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.priority,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
]

export const sortableCols: sortableHeaders = {
    [TableHeadersNames.multipleCheck]: false,
    [TableHeadersNames.epidemiologyNumber]: true,
    [TableHeadersNames.coronaTestDate]: true,
    [TableHeadersNames.isComplex]: false,
    [TableHeadersNames.priority]: false,
    [TableHeadersNames.fullName]: false,
    [TableHeadersNames.phoneNumber]: false,
    [TableHeadersNames.age]: true,
    [TableHeadersNames.city]: true,
    [TableHeadersNames.investigatorName]: true,
    [TableHeadersNames.county]: false,
    [TableHeadersNames.investigationStatus]: true,
    [TableHeadersNames.investigationSubStatus]: false,
    [TableHeadersNames.statusReason]: false,
    [TableHeadersNames.investigationDesk]: false,
    [TableHeadersNames.comment]: false,
    [TableHeadersNames.statusReason]: false,
    [TableHeadersNames.wasInvestigationTransferred]: false,
    [TableHeadersNames.transferReason]: false,
    [TableHeadersNames.groupId]: false,
    [TableHeadersNames.canFetchGroup]: false,
    [TableHeadersNames.groupReason]: false,
}
