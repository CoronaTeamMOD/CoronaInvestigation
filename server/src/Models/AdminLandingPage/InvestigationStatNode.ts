export interface InvestigationStatNode {
    node : {
        investigationStatus : number;
        userByCreator : {
            isActive: boolean;
            userName: string;
        }
    }
}