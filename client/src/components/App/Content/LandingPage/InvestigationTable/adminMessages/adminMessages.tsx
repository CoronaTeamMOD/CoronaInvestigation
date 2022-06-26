import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Card, Typography, Collapse } from '@material-ui/core';

import Desk from 'models/Desk';

import useStyles from './adminMessegesStyles';
import StoreStateType from 'redux/storeStateType';
import { AdminMessage } from 'models/AdminMessage';
import Message from '../../adminLandingPage/adminActions/message/message';
import useAdminMessagesDBAction from '../../adminLandingPage/adminActions/adminMessages/useAdminMessagesDBAction';

const AdminMessages = (props: Props) => {
  const classes = useStyles();
  const { getAdminsMessages, adminMessagesByDesks } = useAdminMessagesDBAction();
  const { setAdminMessageCount } = props;

  const [messages, setMessages] = useState<AdminMessage[]>([]);
  let desksId = props.deskFilter;
  const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
  const desks = useSelector<StoreStateType, Desk[]>(state => state.desk);

  const getDesksFromDeskFilter = (desks: Desk[], countyId: number) => {
    return (
      desks && desks
        .filter(desk => desk.county === countyId)
        .map(desk => desk.id)
    )
  }

  useEffect(() => {
    const formattedDesksId = desksId ?? [];
    const isDesksFilterEmpty = formattedDesksId.length === 0
    const desksIds = isDesksFilterEmpty ? getDesksFromDeskFilter(desks, displayedCounty) : formattedDesksId;
    desksIds !== [] && !desksIds && desksIds!==null && desksIds !== undefined && getAdminsMessages(desksIds);
  }, [displayedCounty])

  useEffect(() => {
    if (adminMessagesByDesks && adminMessagesByDesks !== null) {
      setMessages(adminMessagesByDesks);
      setAdminMessageCount(messages.length);
    }
  }, [adminMessagesByDesks])

  return (
    <Card className={classes.adminMsgSection}>
      <Collapse in={messages.length > 0} unmountOnExit>
        <div>
          {messages.length > 0 ? messages?.map((message: any) => (
            <Typography key={message.id} className={classes.message}>
              {message.message}
            </Typography>
          )) : null}
        </div>
      </Collapse>
    </Card>
  )
}

interface Props {
  deskFilter: (number | null)[];
  setAdminMessageCount: any;
};

export default AdminMessages;
