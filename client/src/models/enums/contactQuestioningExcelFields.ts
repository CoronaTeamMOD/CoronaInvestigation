import InteractedContact from 'models/InteractedContact';
import { string } from 'yup';
import {DBAddress} from "../DBAddress";

export enum booleanAnswers {
    TRUE = 'כן',
    FALSE = 'לא'
};

export const ContactedPersonFieldMapper: ContactedPersonExcel= {
    firstName: 'שם פרטי',
    lastName: 'שם משפחה',
    phoneNumber: 'מספר טלפון',
    additionalPhoneNumber: 'טלפון משני',
    birthDate: 'תאריך לידה',
    gender: 'מגדר',
    identificationNumber: 'ת.ז',
    identificationType: 'סוג ת.ז',
    contactDate: 'תאריך חשיפה',
    contactType: 'סוג מגע',
    extraInfo: 'פירוט נוסף על אופי המגע',
    contactStatus: 'סטטוס',
    relationship: 'קשר',
    familyRelationship: 'קרבה משפחתית',
    occupation: 'האם עוסק באחד מן התחומים הבאים',
    doesHaveBackgroundDiseases: 'האם סובל ממחלות רקע',
    doesFeelGood: 'האם חש בטוב',
    doesNeedHelpInIsolation: 'האם נדרש סיוע עבור מקום בידוד',
    repeatingOccuranceWithConfirmed: 'מפגש חוזר עם המאומת',
    doesLiveWithConfirmed: 'האם חי באותו הבית עם המאומת',
    doesWorkWithCrowd: 'עבודה עם קהל במסגרת העבודה',
    doesNeedIsolation: 'הקמת דיווח בידוד',
    cityId: 'מזהה עיר',
    streetId: 'מזהה רחוב',
    houseNum: 'מספר בית השהייה בבידוד',
    apartment: 'מספר דירה השהייה בבידוד',
};

type AddressNames = { cityId : string , streetId : string , houseNum: string , apartment: string};
export type ContactedPersonExcel =  {
    [K in keyof Omit<InteractedContact, 'id'|'contactEvent'|'involvementReason' | 'involvedContactId'| 'isolationAddress'>]: string;
 }  & AddressNames;

export interface ExcelRow extends ContactedPersonExcel {
    __rowNum__: number;
};

export interface ParsedExcelRow extends InteractedContact {
    rowNum: number;
};