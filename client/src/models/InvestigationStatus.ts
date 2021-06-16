export interface InvestigationStatus {
    mainStatus: number;
    subStatus: string | null;
    statusReason: string | null;
    previousStatus?: number | null;
};