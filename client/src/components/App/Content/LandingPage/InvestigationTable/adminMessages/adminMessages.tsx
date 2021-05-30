import { useSelector } from 'react-redux';
import React, {useEffect, useState} from 'react';
import { Card, Typography, Collapse } from '@material-ui/core';

import Desk from 'models/Desk';

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
  const desks = useSelector<StoreStateType, Desk[]>(state => state.desk);
  
  const getDesksFromDeskFilter = (desks: Desk[], countyId: number) => {
    return (
      desks
        .filter(desk => desk.county === countyId)
        .map(desk => desk.id)
    )
  }

  useEffect(() => {
    const formattedDesksId = desksId ?? []; 
const isDesksFilterEmpty = formattedDesksId.length === 0 
    const desksIds = isDesksFilterEmpty ? getDesksFromDeskFilter(desks, displayedCounty) : formattedDesksId;
    getAdminsMessages(desksIds);
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
  deskFilter: (number|null)[];
};

export default AdminMessages;
