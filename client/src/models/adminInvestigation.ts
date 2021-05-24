interface adminInvestigation {
    id: number;
    creationDate: Date;
    minutes: number;
    deskName: string;
    userName: string;
    hours: number;
    investigationStatus: number;
    subStatus: string | null;
    statusReason: string | null;
};

export default adminInvestigation;