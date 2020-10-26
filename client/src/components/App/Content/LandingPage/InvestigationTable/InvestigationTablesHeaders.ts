import SortOrder from 'models/enums/SortOrder';

export enum TableHeadersNames {
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
    investigationDesk = 'investigationDesk',
    comment = 'comment',
}

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number | boolean};
export type Order = SortOrder.asc | SortOrder.desc;
export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean};

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידמיולוגי',
    [TableHeadersNames.coronaTestDate]: 'תאריך הבדיקה',
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
    [TableHeadersNames.investigationDesk]: 'דסק מבצע',
    [TableHeadersNames.comment]: ' '
}

export const adminCols: string[] = [
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
    [TableHeadersNames.investigationDesk]: false,
    [TableHeadersNames.comment]: false
}
