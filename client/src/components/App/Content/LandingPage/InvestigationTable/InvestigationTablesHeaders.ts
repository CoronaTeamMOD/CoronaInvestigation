import SortOrder from 'models/enums/SortOrder';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

export const investigatorIdPropertyName = 'investigatorId';

export enum TableHeadersNames {
    color = 'color',
    multipleCheck = 'multipleCheck',
    epidemiologyNumber = 'epidemiologyNumber',
    coronaTestDate = 'coronaTestDate',
    isComplex = 'isComplex',
    priority = 'priority',
    fullName = 'fullName',
    phoneNumber = 'phoneNumber',
    age = 'age',
    city = 'city',
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
    otherReason = 'otherReason',
    reasonId = 'reasonId',
    canFetchGroup = 'canFetchGroup',
    settings = 'settings',
    subOccupation = 'subOccupation'
}

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number | boolean | InvestigationMainStatus };
export interface IndexedInvestigationData extends IndexedInvestigation { [investigatorIdPropertyName]: string; }
export type Order = SortOrder.asc | SortOrder.desc;
export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.color]: '',
    [TableHeadersNames.multipleCheck]: '',
    [TableHeadersNames.epidemiologyNumber]: 'מס. אפידמיולוגי',
    [TableHeadersNames.coronaTestDate]: 'תחילת המחלה',
    [TableHeadersNames.isComplex]: '',
    [TableHeadersNames.priority]: 'עדיפות',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.phoneNumber]: 'מספר טלפון',
    [TableHeadersNames.age]: 'גיל',
    [TableHeadersNames.city]: '	עיר מגורים',
    [TableHeadersNames.investigatorName]: 'חוקר מבצע',
    [TableHeadersNames.investigationStatus]: 'סטטוס ביצוע',
    [TableHeadersNames.investigationSubStatus]: 'סטסטוס ביצוע - מידע נוסף',
    [TableHeadersNames.statusReason]: 'סיבה לסטטוס בטיפול',
    [TableHeadersNames.investigationDesk]: 'דסק מבצע',
    [TableHeadersNames.subOccupation]: 'מוסד',
    [TableHeadersNames.comment]: ' ',
    [TableHeadersNames.statusReason]: '',
    [TableHeadersNames.wasInvestigationTransferred]: '',
    [TableHeadersNames.transferReason]: '',
    [TableHeadersNames.groupId]: '',
    [TableHeadersNames.canFetchGroup]: '',
    [TableHeadersNames.groupReason]: '',
    [TableHeadersNames.otherReason]: '',
    [TableHeadersNames.reasonId]: '',
    [TableHeadersNames.settings]: ''
}

export const adminCols: string[] = [
    TableHeadersNames.color,
    TableHeadersNames.multipleCheck,
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.subOccupation,
    TableHeadersNames.investigatorName,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
    TableHeadersNames.settings
]

export const userCols: string[] = [
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.coronaTestDate,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.fullName,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.subOccupation,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
]

export const sortableCols: sortableHeaders = {
    [TableHeadersNames.color]: false,
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
    [TableHeadersNames.otherReason]: false,
    [TableHeadersNames.reasonId]: false,
    [TableHeadersNames.settings]: false,
    [TableHeadersNames.subOccupation]: false
}
