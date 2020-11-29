interface BroadcastMessage {
    message: string;
    isInInvestigation: boolean;
}

export const BC_TABS_NAME = 'investigation_tabs_channel';

export default BroadcastMessage;