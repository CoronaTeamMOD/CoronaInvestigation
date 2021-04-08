import GreenPassAnswer from 'models/GreenPassAnswer';
import GreenPassQuestion from 'models/GreenPassQuestion';

export interface useGreenPassQuestioningOutcome {
    greenPassQuestions: GreenPassQuestion[];
    greenPassAnswers: GreenPassAnswer[];
};