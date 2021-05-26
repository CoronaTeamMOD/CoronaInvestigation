import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography, Collapse } from '@material-ui/core';

import useStyles from './adminMessegesStyles';
import StoreStateType from 'redux/storeStateType';
import { AdminMessage } from 'models/AdminMessage';
import Message from '../../adminLandingPage/adminActions/message/message';
import useAdminMessagesDBAction from '../../adminLandingPage/adminActions/adminMessages/useAdminMessagesDBAction';

const AdminMessages: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { getAdminsMessages, adminMessagesByDesks } = useAdminMessagesDBAction();

  const messageTitle = 'הודעת אדמין';
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  let desksId = props.deskFilter;
  const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);

  useEffect(() => {
    if(desksId === undefined){
      //get from reduxs.desks an array the have all the desks with county number - displayedCounty
    }
    getAdminsMessages(desksId);
  }, [])

  useEffect(() => {
    if (adminMessagesByDesks && adminMessagesByDesks?.length > 0) {
      setMessages(adminMessagesByDesks)
    }
  }, [adminMessagesByDesks])

    return (
      <Card className={classes.card}>
          <Typography className={classes.cardTitle}>
            <b>{messageTitle}</b>
          </Typography>
          <Collapse in={messages.length > 0} unmountOnExit>
            <div>
              {messages.map((message: any) => (
                <Message 
                  key={message.id}
                  messageText={message.message}
                  onButtonClick={(message: string)=>{console.log('remove ', message)}}
                  isNewMessage={false}
                  toDisable={true}
                  toEnableAction={false}
                />
              ))}
            </div>
          </Collapse>
        </Card>
    )
}

interface Props {
  deskFilter: any
};

export default AdminMessages;
