import React, { useState } from 'react';
import { Close as CloseIcon, AddCircle as AddCircleIcon} from '@material-ui/icons';
import {
    Dialog, DialogTitle, DialogActions, Button, DialogContent,
    FormControl, Typography, IconButton, Select, MenuItem, Divider, TextField
} from "@material-ui/core";

import useStyles from './NewContactDialogStyles';
import Location from 'models/LocationType';

const DIALOG_TITLE = 'יצירת מקום/מגע חדש';
const LOCATION_TYPE = 'סוג אתר:';
const CONTACT_NAME = 'שם';
const CONTACT_ID = 'ת.ז';
const CONTACT_PHONE = 'מספר טלפון';
const CANCEL_LABEL = 'ביטול';
const ADD_CONTACT = 'הוסף מגע';

const NewContactDialog: React.FC<Props> = (newContactDialogProps: Props) => {
    const [ isCreateContactEnabled, setIsCreateContactEnabled ] = useState(false);
    const [ contactedPersonName, setContactedPersonName ] = useState('');
    const [ contactedPersonID, setContactedPersonID ] = useState('');
    const [ contactedPersonPhone, setContactedPersonPhone ] = useState('');
    const [ pickedLocation, setPickedLocation ] = useState('');

    const classes = useStyles();

    const handleLocationPick = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPickedLocation(event.target.value as string);
    }

    const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContactedPersonName(event.target.value as string);
    }

    const handlePhoneChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContactedPersonPhone(event.target.value as string);
    }

    const handleIDChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContactedPersonID(event.target.value as string);
    }

    return (
        <Dialog open={newContactDialogProps.isDialogOpen} maxWidth={false}>
            <div className={classes.contactDialog}>
                <div className={classes.dialogHeader}>
                    <Typography className={classes.headerTitle}>{DIALOG_TITLE}</Typography>
                    <IconButton onClick={() => newContactDialogProps.setDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <DialogContent>
                    <div className={classes.mainExposureDetails}>
                        <FormControl variant={'outlined'} className={classes.locationSelection}>
                            <Typography className={classes.fieldLabel}>{LOCATION_TYPE}</Typography>
                            <Select className={classes.locationPicker} value={pickedLocation} onChange={handleLocationPick}>
                                {
                                    newContactDialogProps.allLocationTypes.map((loc) =>
                                        <MenuItem value={loc.name}>{loc.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Divider light={true} className={classes.formDivider}/>
                    <FormControl variant={'outlined'} className={classes.newContactedPersonFields}>
                        <div className={classes.singleContactField}>
                            <Typography className={classes.fieldLabel}>{CONTACT_NAME + ': '}</Typography>
                            <TextField className={classes.newContactFields} label={CONTACT_NAME} value={contactedPersonName} onChange={handleNameChange}/>
                        </div>
                        <div className={classes.singleContactField}>
                            <Typography className={classes.fieldLabel}>{CONTACT_PHONE + ': '}</Typography>
                            <TextField className={classes.newContactFields} label={CONTACT_PHONE} value={contactedPersonPhone} onChange={handlePhoneChange} required={contactedPersonName !== ''}/>
                        </div>
                        <div className={classes.singleContactField}>
                            <Typography className={classes.fieldLabel}>{CONTACT_ID + ': '}</Typography>
                            <TextField className={classes.newContactFields} label={CONTACT_ID} value={contactedPersonID} onChange={handleIDChange}/>
                        </div>
                        <div>
                            <IconButton>
                                <AddCircleIcon />
                            </IconButton>
                            <Typography>{ADD_CONTACT}</Typography>
                        </div>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <div className={classes.contactCreationActions}>
                        <Button onClick={() => newContactDialogProps.setDialogOpen(false)}>{CANCEL_LABEL}</Button>
                        <Button disabled={isCreateContactEnabled}>{ADD_CONTACT}</Button>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
}

interface Props {
    isDialogOpen: boolean,
    allLocationTypes: Location[],
    setDialogOpen: (isDialogOpen: boolean) => void,
}

export default NewContactDialog;