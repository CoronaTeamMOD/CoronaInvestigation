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
    getAdminsMessages(desksIds);
  }, [displayedCounty])

  useEffect(() => {
    if (adminMessagesByDesks) {
      setAdminMessageCount(adminMessagesByDesks.length);
    } 
  }, [adminMessagesByDesks])

  return (
    <Card className={classes.adminMsgSection}>
      { adminMessagesByDesks && adminMessagesByDesks.length > 0 &&
        <div>
          {adminMessagesByDesks?.map((message: any) => (
            <Typography className={classes.message}>
              {message.message}
            </Typography>
          ))}
        </div>
     }
    </Card>
  )
}

interface Props {
  deskFilter: (number | null)[];
  setAdminMessageCount: any;
};

export default AdminMessages;
