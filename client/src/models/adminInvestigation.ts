interface adminInvestigation {
    id: number;
    creation_date: Date;
    minutes: number;
    deskName: string;
    userName: string;
    hours: number;
    investigation_status: number;
    sub_status: string | null;
    status_reason: string | null;
};

export default adminInvestigation;