export enum TableHeadersNames {
    epidemiologyNumber = 'epidemiologyNumber',
    coronaTestDate = 'coronaTestDate',
    priority = 'priority',
    fullName = 'fullName',
    phoneNumber = 'phoneNumber',
    age = 'age',
    city = 'city',
    county = 'county',
    investigatorName = 'investigatorName',
    investigationStatus = 'investigationStatus'
}

export enum sortOrders {
    asc = 'asc',
    desc = 'desc'
}

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number};
export type Order = sortOrders.asc | sortOrders.desc;
export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean};

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידמיולוגי',
    [TableHeadersNames.coronaTestDate]: 'תאריך הבדיקה',
    [TableHeadersNames.priority]: 'עדיפות',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.phoneNumber]: 'מספר טלפון',
    [TableHeadersNames.age]: 'גיל',
    [TableHeadersNames.city]: '	עיר מגורים',
    [TableHeadersNames.investigatorName]: 'חוקר מבצע',
    [TableHeadersNames.county]: 'נפה מבצעת',
    [TableHeadersNames.investigationStatus]: 'סטטוס ביצוע',
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
    TableHeadersNames.investigationStatus
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
]

export const sortableCols: sortableHeaders = {
    [TableHeadersNames.epidemiologyNumber]: true,
    [TableHeadersNames.coronaTestDate]: true,
    [TableHeadersNames.priority]: false,
    [TableHeadersNames.fullName]: false,
    [TableHeadersNames.phoneNumber]: false,
    [TableHeadersNames.age]: true,
    [TableHeadersNames.city]: true,
    [TableHeadersNames.investigatorName]: true,
    [TableHeadersNames.county]: false,
    [TableHeadersNames.investigationStatus]: true,
}
