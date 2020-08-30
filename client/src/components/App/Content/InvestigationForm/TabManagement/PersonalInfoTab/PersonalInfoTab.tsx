import React from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import useStyles from './PersonalInfoTabStyles';

const PersonalInfoTab: React.FC<Props> = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoFields: string[] = [
        'טלפון',
        'מין',
        'סוג תעודה מזהה',
        'גיל',
        'שמות הורי הקטין',
        'קופת חולים',
        'כתובת',
        'האם עובד באחד מהבאים'
    ]
  
    return (
        <div className={classes.wrapper}>      
            <Typography variant='body2' className={classes.box1} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box2} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box3} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box4} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box5} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box6} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box7} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>
            <Typography variant='body2' className={classes.box8} >
                <b><bdi>{personalInfoFields[0]}</bdi>: </b>
            </Typography>

            <div className={classes.PersonalInfoFieldsContainer}>
                <div className={classes.rowContainer}>
                    <TextField></TextField>
                </div>
            </div>
        </div>
    )
};

interface Props {

}

export default PersonalInfoTab;
