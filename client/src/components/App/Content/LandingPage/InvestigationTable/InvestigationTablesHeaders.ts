export enum TableHeadersNames {
    epidemiologyNumber = 'epidemiologyNumber',
    coronaTestDate = 'coronaTestDate',
    fullName = 'fullName',
    phoneNumber = 'phoneNumber',
    age = 'age',
    city = 'city',
    investigatorName = 'investigatorName',
    status = 'status'
}

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number};

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידמיולוגי',
    [TableHeadersNames.coronaTestDate]: 'תאריך הבדיקה',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.phoneNumber]: 'מספר טלפון',
    [TableHeadersNames.age]: 'גיל',
    [TableHeadersNames.city]: '	עיר מגורים',
    [TableHeadersNames.investigatorName]: 'חוקר מבצע',
    [TableHeadersNames.status]: 'סטטוס ביצוע',
}

export const adminCols: string[] = [
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.investigatorName,
    TableHeadersNames.status
]

export const userCols: string[] = [
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.status,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
]