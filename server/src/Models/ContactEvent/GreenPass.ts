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

export interface GetGreenPassAnswersResponse {
    data: {
        allGreenPassAnswers: {
            nodes: GreenPassQuestion[]
        }
    }
};

export interface greenPassAnswer {
    id: number;
    displayName: string;
};