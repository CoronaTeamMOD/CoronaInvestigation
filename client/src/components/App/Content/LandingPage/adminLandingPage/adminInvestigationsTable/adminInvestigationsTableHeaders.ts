export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export enum TableHeadersNames {
    startTime = 'start_time',
    minutes = 'minutes',
    deskName = 'desk_name',
    userName = 'user_name',
    hours = 'hours'   
}

export const TableHeaders = {
    [TableHeadersNames.startTime]: 'הגעת חקירה',
    [TableHeadersNames.minutes]: 'דקות',
    [TableHeadersNames.deskName]: 'דסק',
    [TableHeadersNames.userName]: 'חוקר',
    [TableHeadersNames.hours]: 'תצוגת משך חקירה(לפי שעות)'
}

export const SortableTableHeaders = {
    [TableHeadersNames.startTime]: true,
    [TableHeadersNames.minutes]: true,
    [TableHeadersNames.deskName]: true,
    [TableHeadersNames.userName]: true,
    [TableHeadersNames.hours]: true
}