export enum TableHeadersNames {
    userName = 'userName',
    sourceOrganization = 'sourceOrganization',
    deskName = 'deskByDeskId.deskName',
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