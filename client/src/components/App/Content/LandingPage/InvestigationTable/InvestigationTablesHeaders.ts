import SortOrder from 'models/enums/SortOrder';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

export const investigatorIdPropertyName = 'investigatorId';

export enum TableHeadersNames {
    color = 'color',
    rowIndicators = 'rowIndicators',
    multipleCheck = 'multipleCheck',
    epidemiologyNumber = 'epidemiologyNumber',
    validationDate = 'validationDate',
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
    subOccupation = 'subOccupation',
    isSelfInvestigated = 'isSelfInvestigated',
    selfInvestigationStatus = 'selfInvestigationStatus',
    selfInvestigationUpdateTime = 'selfInvestigationUpdateTime',
    lastChatDate='lastChatDate',
    chatStatus='chatStatus',
    investigatiorReferenceRequired='investigatiorReferenceRequired',
    investigatorReferenceStatus='investigatorReferenceStatus'
    
}

export enum HiddenTableKeys {
    county = 'county',
}

export type TableKeys = TableHeadersNames | HiddenTableKeys;

export type IndexedInvestigation = { [T in keyof typeof TableHeadersNames]: string | number | boolean | InvestigationMainStatus };
export interface IndexedInvestigationData extends IndexedInvestigation { [investigatorIdPropertyName]: string; }
export type Order = SortOrder.asc | SortOrder.desc;
export type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean };

export const TableHeaders: IndexedInvestigation = {
    [TableHeadersNames.color]: '',
    [TableHeadersNames.rowIndicators]: '',
    [TableHeadersNames.multipleCheck]: '',
    [TableHeadersNames.epidemiologyNumber]: 'מס. אפידמיולוגי',
    [TableHeadersNames.validationDate]: 'תחילת המחלה',
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
    [TableHeadersNames.comment]: 'הערה',
    [TableHeadersNames.statusReason]: '',
    [TableHeadersNames.wasInvestigationTransferred]: '',
    [TableHeadersNames.transferReason]: '',
    [TableHeadersNames.groupId]: '',
    [TableHeadersNames.canFetchGroup]: '',
    [TableHeadersNames.groupReason]: '',
    [TableHeadersNames.otherReason]: '',
    [TableHeadersNames.reasonId]: '',
    [TableHeadersNames.settings]: '',
    [TableHeadersNames.isSelfInvestigated]: '',
    [TableHeadersNames.selfInvestigationStatus]: '',
    [TableHeadersNames.selfInvestigationUpdateTime]: '',
    [TableHeadersNames.lastChatDate]:'תאריך עדכון אחרון בבוט',
    [TableHeadersNames.chatStatus]:'סטטוס שיחה בבוט',
    [TableHeadersNames.investigatiorReferenceRequired]:'',
    [TableHeadersNames.investigatorReferenceStatus]:'סטטוס טיפול בחקירה בוט'
}

export const adminCols: string[] = [
    TableHeadersNames.color,
    TableHeadersNames.multipleCheck,
    TableHeadersNames.rowIndicators,
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.validationDate,
    TableHeadersNames.fullName,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.subOccupation,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.investigatorName,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
    TableHeadersNames.investigatiorReferenceRequired,
    TableHeadersNames.chatStatus,
    TableHeadersNames.lastChatDate,
    TableHeadersNames.investigatorReferenceStatus,
    TableHeadersNames.settings
]

export const userCols: string[] = [
    TableHeadersNames.color,
    TableHeadersNames.multipleCheck,
    TableHeadersNames.rowIndicators,
    TableHeadersNames.epidemiologyNumber,
    TableHeadersNames.validationDate,
    TableHeadersNames.investigationStatus,
    TableHeadersNames.fullName,
    TableHeadersNames.age,
    TableHeadersNames.city,
    TableHeadersNames.subOccupation,
    TableHeadersNames.phoneNumber,
    TableHeadersNames.investigationDesk,
    TableHeadersNames.comment,
    TableHeadersNames.investigatiorReferenceRequired,
    TableHeadersNames.chatStatus,
    TableHeadersNames.lastChatDate,
    TableHeadersNames.investigatorReferenceStatus,
    TableHeadersNames.settings
]

export const sortableCols: sortableHeaders = {
    [TableHeadersNames.color]: false,
    [TableHeadersNames.rowIndicators]: false,
    [TableHeadersNames.multipleCheck]: false,
    [TableHeadersNames.epidemiologyNumber]: true,
    [TableHeadersNames.validationDate]: true,
    [TableHeadersNames.isComplex]: false,
    [TableHeadersNames.priority]: false,
    [TableHeadersNames.fullName]: true,
    [TableHeadersNames.phoneNumber]: false,
    [TableHeadersNames.age]: true,
    [TableHeadersNames.city]: true,
    [TableHeadersNames.investigatorName]: true,
    [TableHeadersNames.investigationStatus]: true,
    [TableHeadersNames.investigationSubStatus]: false,
    [TableHeadersNames.statusReason]: false,
    [TableHeadersNames.investigationDesk]: true,
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
    [TableHeadersNames.subOccupation]: true,
    [TableHeadersNames.isSelfInvestigated]: false,
    [TableHeadersNames.selfInvestigationStatus]: false,
    [TableHeadersNames.selfInvestigationUpdateTime]: false,
    [TableHeadersNames.lastChatDate]:true,
    [TableHeadersNames.chatStatus]:true,
    [TableHeadersNames.investigatiorReferenceRequired]:false,
    [TableHeadersNames.investigatorReferenceStatus]:true
}
