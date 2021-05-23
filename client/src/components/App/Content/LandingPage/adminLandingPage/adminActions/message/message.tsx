import React, {useState} from 'react';
import { Delete } from '@material-ui/icons';
import { Grid, Button, TextField, Collapse, IconButton } from '@material-ui/core';

import useStyles from './messegeStyles';

const Message: React.FC<Props> = (props: Props): JSX.Element => {
 

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
              id="outlined-basic" 
              variant="outlined"
              placeholder="הקלד הודעה חדשה"
            />
          </Grid>
          <Grid item xs={1}>
            <Collapse in={props.isNewMessage}>
              <Button 
                fullWidth
                className={classes.button}
                variant="contained" 
                color="primary"
                onClick={()=>{props.onButtonClick(message)}}
                disabled={!(message && message !== '')}>
                  <b>{sendText}</b>
              </Button>
            </Collapse>
            <Collapse in={!props.isNewMessage}>
              <IconButton 
                onClick={()=>{props.onButtonClick(message)}}
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
  onButtonClick: (message: string) => void
  isNewMessage: boolean
};

export default Message;
