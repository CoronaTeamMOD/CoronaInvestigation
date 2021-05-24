import React from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';

import useStyles from './adminMessegesStyles';
import Message from '../message/message';

const AdminMessages = (): JSX.Element => {
  const classes = useStyles();

  const messageTitle = 'הודעה';
  const messageDescriptionTitle = '(תוצג בטבלת הדסק המסומן בעמוד זה)';
  const messages = [{messageText: 'yalla hi', id: '1', Desk: '', Admin: ''}, {messageText: 'yalla Bye', id: '2', Desk: '', Admin: ''}]

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

export default AdminMessages;
