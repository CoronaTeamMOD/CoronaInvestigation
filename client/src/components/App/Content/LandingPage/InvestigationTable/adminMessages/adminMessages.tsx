import React from 'react';
import { Card, Typography, Collapse } from '@material-ui/core';

import useStyles from './adminMessegesStyles';
import Message from '../../adminLandingPage/adminActions/message/message';

const AdminMessages = (): JSX.Element => {
  const classes = useStyles();

  const messageTitle = 'הודעת אדמין';
  const messages = [{messageText: 'yalla hi', id: '1', Desk: '', Admin: ''}, {messageText: 'yalla Bye', id: '2', Desk: '', Admin: ''}]

    return (
      <Card className={classes.card}>
          <Typography className={classes.cardTitle}>
            <b>{messageTitle}</b>
          </Typography>
          <Collapse in={messages.length>0} unmountOnExit>
            <div>
              {messages.map((message: any) => (
                <Message 
                  key={message.id}
                  messageText={message.messageText}
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

export default AdminMessages;
