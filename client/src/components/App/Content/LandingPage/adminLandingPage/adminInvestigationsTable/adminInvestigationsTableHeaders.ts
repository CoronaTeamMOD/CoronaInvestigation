export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export enum TableHeadersNames {
    creationDate = 'creation_date',
    minutes = 'minutes',
    deskName = 'desk_name',
    userName = 'user_name',
    hours = 'hours'   
}

export const TableHeaders = {
    [TableHeadersNames.creationDate]: 'הגעת חקירה',
    [TableHeadersNames.minutes]: 'דקות',
    [TableHeadersNames.deskName]: 'דסק',
    [TableHeadersNames.userName]: 'חוקר',
    [TableHeadersNames.hours]: 'תצוגת משך חקירה(לפי שעות)'
}

export const SortableTableHeaders = {
    [TableHeadersNames.creationDate]: true,
    [TableHeadersNames.minutes]: true,
    [TableHeadersNames.deskName]: true,
    [TableHeadersNames.userName]: true,
    [TableHeadersNames.hours]: true
}