import React, {useState} from 'react';
import { Delete } from '@material-ui/icons';
import { Grid, Button, TextField, Collapse, IconButton } from '@material-ui/core';

import useStyles from './messegeStyles';

const Message = (props: Props) => {

  const classes = useStyles();
  const [message, setMessage] = useState<string>(props.messageText);

  const sendText = 'שליחה';

    return (
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField 
              fullWidth
              value={message}
              onChange={event => setMessage(event.target.value as string)}
              id='outlined-basic' 
              variant='outlined'
              placeholder='הקלד הודעה חדשה'
              disabled = {props.toDisable}
            />
          </Grid>
          <Grid item xs={1}>
            <Collapse in={props.isNewMessage}>
              <Button 
                fullWidth
                className={classes.button}
                variant='contained' 
                color='primary'
                onClick={()=>{props.sendMessage && props.sendMessage(message)}}
                disabled={!(message && message !== '')}>
                  <b>{sendText}</b>
              </Button>
            </Collapse>
            <Collapse in={!props.isNewMessage && props.toEnableAction}>
              <IconButton 
                onClick={()=>{props.deleteMessage && props.deleteMessage()}}
                disabled={!(message && message !== '')}>
                <Delete />
              </IconButton>
            </Collapse>
          </Grid>
        </Grid>
    )
}

interface Props {
  messageText: string;
  sendMessage?: (message: string) => void;
  deleteMessage?: () => void;
  isNewMessage: boolean;
  toDisable: boolean;
  toEnableAction: boolean;
};

export default Message;
