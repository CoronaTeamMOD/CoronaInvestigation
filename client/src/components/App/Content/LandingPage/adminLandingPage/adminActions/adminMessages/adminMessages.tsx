import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Collapse } from '@material-ui/core';

import Message from '../message/message';
import useStyles from './adminMessegesStyles';
import StoreStateType from 'redux/storeStateType';
import { AdminMessage } from 'models/AdminMessage';
import useAdminMessagesDBAction from './useAdminMessagesDBAction';
import Desk from 'models/Desk';

const AdminMessages: React.FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles();
  const { getAdminsMessagesByAdmin, adminsMessagesByAdmin } = useAdminMessagesDBAction();

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

  useEffect(() => {
    const isDesksFilterEmpty = desksId.length === 0;
    const desksIds = isDesksFilterEmpty ? getDesksFromDeskFilter(desks, displayedCounty) : desksId;
    getAdminsMessagesByAdmin(desksIds, adminId);
  }, [])

  useEffect(() => {
    if (adminsMessagesByAdmin && adminsMessagesByAdmin?.length > 0) {
      setMessages(adminsMessagesByAdmin)
    }
  }, [adminsMessagesByAdmin])


    return (
        <Grid>
          <Typography className={classes.cardTitle}>
            <b>{messageTitle}</b> {messageDescriptionTitle}
          </Typography>
          <Message 
            key='0'
            messageText={''}
            onButtonClick={(message: string)=>{console.log('send ' , message)}}
            isNewMessage={true}
            toDisable={false}
            toEnableAction={true}
          />
          <Collapse in={messages.length>0} unmountOnExit>
            <div>
              {messages.map((message: any) => (
                <Message 
                  key={message.id}
                  messageText={message.messageText}
                  onButtonClick={(message: string)=>{console.log('remove ', message)}}
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
