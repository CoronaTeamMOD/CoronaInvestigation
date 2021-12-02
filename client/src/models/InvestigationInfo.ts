import StaticUser from './StaticUser';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import InvestigatedPatientStaticInfo from './InvestigatedPatientStaticInfo';
import PersonStaticInfo from './PersonStaticInfo';
import KeyValuePair from './KeyValuePair';

interface InvestigationInfo extends SymptomsExistenceInfo, InvestigatedPatientStaticInfo, PersonStaticInfo {
    comment: string | null;
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    investigatedPatientId: number;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
    endTime: Date | null;
};

export interface InvestigationInfoData extends Omit<InvestigationInfo, 'validationDate' | 'symptomsStartDate'> {
    validationDate: string;
    symptomsStartDate: string;
    trackingSubReasonByTrackingSubReason: {
        reasonId: number | null;
        subReasonId?: number;
    };
    trackingExtraInfo?: string;
};

export interface BotInvestigationInfo {
    epidemiologyNumber: number;
    lastChatDate: string | null;
    investigatiorReferenceRequired: boolean;
    chatStatus: KeyValuePair;
    investigationChatStatus: KeyValuePair;
    investigatorReferenceStatus: KeyValuePair;
    botInvestigationReferenceReasons: KeyValuePair[];
}

export default InvestigationInfo;