import React from 'react';
import axios  from 'axios';
import {useSelector} from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import GreenPassQuestion from 'models/GreenPassQuestion';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import StoreStateType from 'redux/storeStateType';
import { setGreenPassQuestions } from 'redux/GreenPass/greenPassActionCreators';

const useGreenPassQuestioning = () => {

    const greenPassQuestions = useSelector<StoreStateType, GreenPassQuestion[]>(state => state.greenPassQuestions);

    const getGreenPassQuestions = () => {
        if (Object.keys(greenPassQuestions).length > 0) {
            return;
        };

        const getGreenPassQuestionsLogger = logger.setup('Fetching Places And Sub Types By Types');
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

    React.useEffect(() => {
        getGreenPassQuestions();
    }, []);

    return {
        greenPassQuestions
    };
};

export default useGreenPassQuestioning;