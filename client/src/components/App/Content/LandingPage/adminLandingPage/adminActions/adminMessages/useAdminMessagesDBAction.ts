import axios  from 'axios';
import { useState } from 'react';

import logger from 'logger/logger';
import { AdminMessage } from 'models/AdminMessage';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useAdminDBAction = () => {    
    const { alertError } = useCustomSwal();
  const [adminMessagesByDesks, setAdminMessagesByDesks] = useState<AdminMessage[] | null>(null);
  const [adminsMessagesByAdmin, setAdminMessagesByAdmin] = useState<AdminMessage[] | null>(null);

    const getAdminsMessages = (desksId: (number | null)[]) => {
        const adminMessageLogger = logger.setup('get admin messages by desks');
        adminMessageLogger.info('launching DB request', Severity.LOW);
        axios.get<AdminMessage[]>(`/landingPage/adminMessages/${[desksId]}`, {
        }).then(result => {
                adminMessageLogger.info('request was successful', Severity.LOW);
                setAdminMessagesByDesks(result.data)
            })
            .catch(err => {
                adminMessageLogger.error(`recived error during request, err: ${err}`, Severity.HIGH);
            });
    }

    const getAdminsMessagesByAdmin = (desksId: number[], adminId: string) => {
        const adminMessageLogger = logger.setup('get admin messages by desks');
        adminMessageLogger.info('launching DB request', Severity.LOW);
        axios.get<AdminMessage[]>(`/landingPage/adminMessages/${desksId}/${adminId}`, {
        }).then(result => {
                adminMessageLogger.info('request was successful', Severity.LOW);
                console.log(result);
                console.log('result.data');
                setAdminMessagesByAdmin(result.data)
            })
            .catch(err => {
                adminMessageLogger.error(`recived error during request, err: ${err}`, Severity.HIGH);
            });
    }

    return {
        getAdminsMessages,
        getAdminsMessagesByAdmin,
        adminMessagesByDesks,
        setAdminMessagesByAdmin,
        adminsMessagesByAdmin
    };
};

interface Props {

};

export default useAdminDBAction;