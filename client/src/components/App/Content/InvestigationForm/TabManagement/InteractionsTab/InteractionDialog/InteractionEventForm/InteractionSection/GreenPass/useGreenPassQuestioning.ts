import React from 'react';
import axios  from 'axios';
import {useSelector} from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import GreenPassAnswer from 'models/GreenPassAnswer';
import GreenPassQuestion from 'models/GreenPassQuestion';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setGreenPassAnswers, setGreenPassQuestions } from 'redux/GreenPass/greenPassActionCreators';

import { useGreenPassQuestioningOutcome } from './GreenPassInterfaces';

const useGreenPassQuestioning = () : useGreenPassQuestioningOutcome => {

    const greenPassQuestions = useSelector<StoreStateType, GreenPassQuestion[]>(state => state.greenPass.greenPassQuestions);
    const greenPassAnswers = useSelector<StoreStateType, GreenPassAnswer[]>(state => state.greenPass.greenPassAnswers);

    const getGreenPassQuestions = () => {
        if (Object.keys(greenPassQuestions).length > 0) {
            return;
        };

        const getGreenPassQuestionsLogger = logger.setup('Fetching Green Pass Questions');
        getGreenPassQuestionsLogger.info('launching request to get green pass questions', Severity.LOW);
        setIsLoading(true)
        axios.get('/intersections/greenPassQuestions').then(
            result => {
                if (result?.data) {
                    getGreenPassQuestionsLogger.info('green pass questions request was successful', Severity.LOW);
                    setGreenPassQuestions(result.data);
                } else {
                    getGreenPassQuestionsLogger.warn('got status 200 but wrong data', Severity.HIGH);
                }
            }
        ).catch((error) => {
            getGreenPassQuestionsLogger.error(`got errors in fetching green pass questions: ${error}`,Severity.HIGH);
        }).finally(() => setIsLoading(false))
    };

    const getGreenPassAnswers = () => {
        if (Object.keys(greenPassAnswers).length > 0) {
            return;
        };

        const getGreenPassAnswersLogger = logger.setup('Fetching Green Pass Answers');
        getGreenPassAnswersLogger.info('launching request to get green pass answers', Severity.LOW);
        setIsLoading(true)
        axios.get('/intersections/greenPassAnswers').then(
            result => {
                if (result?.data) {
                    getGreenPassAnswersLogger.info('green pass answers request was successful', Severity.LOW);
                    setGreenPassAnswers(result.data);
                } else {
                    getGreenPassAnswersLogger.warn('got status 200 but wrong data', Severity.HIGH);
                }
            }
        ).catch((error) => {
            getGreenPassAnswersLogger.error(`got errors in fetching green pass answers: ${error}`,Severity.HIGH);
        }).finally(() => setIsLoading(false))
    };

    React.useEffect(() => {
        getGreenPassQuestions();
        getGreenPassAnswers();
    }, []);

    return {
        greenPassQuestions,
        greenPassAnswers
    };
};

export default useGreenPassQuestioning;