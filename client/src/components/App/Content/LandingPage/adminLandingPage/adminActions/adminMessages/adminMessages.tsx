import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Collapse } from '@material-ui/core';

import Desk from 'models/Desk';
import Message from '../message/message';
import useStyles from './adminMessegesStyles';
import StoreStateType from 'redux/storeStateType';
import { AdminMessage } from 'models/AdminMessage';
import useAdminMessagesDBAction from './useAdminMessagesDBAction';

const AdminMessages = (props: Props) => {
  const classes = useStyles();
  const { getAdminsMessagesByAdmin, adminsMessagesByAdmin, sendMessage, deleteMessage, toRefresh } = useAdminMessagesDBAction();

  const messageTitle = 'הודעה';
  const messageDescriptionTitle = '(תוצג בטבלת הדסק המסומן בעמוד זה)';
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  let desksId = props.investigationInfoFilter?.deskFilter;
  const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
  const adminId = useSelector<StoreStateType, string>(state => state.user.data.id);
  const desks = useSelector<StoreStateType, Desk[]>(state => state.desk);

  const getDesksFromDeskFilter = (desks: Desk[], countyId: number) => {
    return (
      desks
        .filter(desk => desk.county === countyId)
        .map(desk => desk.id)
    )
  }
  const formattedDesksId = desksId ?? []
  const isDesksFilterEmpty = formattedDesksId.length === 0;
  const desksIds = isDesksFilterEmpty ? getDesksFromDeskFilter(desks, displayedCounty) : formattedDesksId;

  useEffect(() => {
    getAdminsMessagesByAdmin(desksIds, adminId);
  }, [])

  useEffect(() => {
    if (adminsMessagesByAdmin && adminsMessagesByAdmin?.length > 0) {
      setMessages(adminsMessagesByAdmin)
    }
  }, [adminsMessagesByAdmin])

  useEffect(() => {
    getAdminsMessagesByAdmin(desksIds, adminId);
  }, [toRefresh])

    return (
        <Grid>
          <Typography className={classes.cardTitle}>
            <b>{messageTitle}</b> {messageDescriptionTitle}
          </Typography>
          <Message 
            key={0}
            messageText={''}
            sendMessage={(message: string)=>{sendMessage(message, adminId, desksIds)}}
            isNewMessage={true}
            toDisable={false}
            toEnableAction={true}
          />
          <Collapse in={messages.length>0} unmountOnExit>
            <div>
              {messages?.map((message: any) => (
                <Message 
                  key={message.id}
                  messageText={message.message}
                  deleteMessage={()=>{deleteMessage(message.id)}}
                  isNewMessage={false}
                  toDisable={true}
                  toEnableAction={true}
                />
              ))}
            </div>
          </Collapse> 
        </Grid>
    )
}

interface Props {
  investigationInfoFilter: any
};

export default AdminMessages;
