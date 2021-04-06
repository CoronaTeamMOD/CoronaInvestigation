export interface GetGreenPassQuestionsResponse {
    data: {
        allGreenPassQuestions: {
            nodes: GreenPassQuestion[]
        }
    }
};

export interface GreenPassQuestion {
    id: number;
    displayName: string;
};