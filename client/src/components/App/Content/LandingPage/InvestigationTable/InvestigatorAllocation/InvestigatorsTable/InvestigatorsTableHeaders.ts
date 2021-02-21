export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export enum TableHeadersNames {
    userName = 'userName',
    sourceOrganization = 'sourceOrganization',
    deskName = 'deskname',
    newInvestigationsCount = 'newInvestigationsCount',
    activeInvestigationsCount = 'activeInvestigationsCount',
    pauseInvestigationsCount = 'pauseInvestigationsCount',
    languages = 'languages'
}

export const TableHeaders = {
    [TableHeadersNames.userName]: 'שם',
    [TableHeadersNames.sourceOrganization]: 'שיוך',
    [TableHeadersNames.deskName]: 'דסק',
    [TableHeadersNames.newInvestigationsCount]: 'חקירות חדשות',
    [TableHeadersNames.activeInvestigationsCount]: 'חקירות בטיפול',
    [TableHeadersNames.pauseInvestigationsCount]: 'חקירות בהשהיה',
    [TableHeadersNames.languages]: 'שפות'
}

export const SortableTableHeaders = {
    [TableHeadersNames.userName]: true,
    [TableHeadersNames.sourceOrganization]: true,
    [TableHeadersNames.deskName]: true,
    [TableHeadersNames.newInvestigationsCount]: false,
    [TableHeadersNames.activeInvestigationsCount]: false,
    [TableHeadersNames.pauseInvestigationsCount]: false,
    [TableHeadersNames.languages]: false
}