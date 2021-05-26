import axios  from 'axios';
import { useState } from 'react';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { AdminMessage } from 'models/AdminMessage';
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
                setAdminMessagesByAdmin(result.data)
            })
            .catch(err => {
                adminMessageLogger.error(`recived error during request, err: ${err}`, Severity.HIGH);
            });
    }

    const sendMessage = (message: string, adminId: string, desksId: number[]) => {
        const adminMessageLogger = logger.setup('send admin messages');
        adminMessageLogger.info('launching DB request', Severity.LOW);
        const parameters: AdminMessage = {
            message,
            id: 555,
            admin_id: adminId,
            desks_id: desksId
        }
        axios.post('/landingPage/sendMessage',
            parameters).then((result) => {
            adminMessageLogger.info('new successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את ההודעה שלך');
            adminMessageLogger.error(`error in sending new message ${error}`, Severity.LOW);
        });
    };

    const deleteMessage = (id: number) => {
        const adminMessageLogger = logger.setup('delete admin messages');
        adminMessageLogger.info('launching DB request', Severity.LOW);
        axios.post('/landingPage/deleteMessage',
            id).then((result) => {
            adminMessageLogger.info('delete messeage successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו למחוק את ההודעה שלך');
            adminMessageLogger.error(`error in delete message ${error}`, Severity.LOW);
        });
    }

    return {
        getAdminsMessages,
        getAdminsMessagesByAdmin,
        adminMessagesByDesks,
        setAdminMessagesByAdmin,
        adminsMessagesByAdmin,
        sendMessage,
        deleteMessage
    };
};

interface Props {

};

export default useAdminDBAction;