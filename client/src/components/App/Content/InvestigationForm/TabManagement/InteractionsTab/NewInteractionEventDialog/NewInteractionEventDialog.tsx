import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Select, MenuItem, Collapse } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventVariables from 'models/InteractionEventVariables';

import useStyles from './NewInteractionEventDialogStyles';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import FormInput from 'commons/FormInput/FormInput';


export interface Props {
    isOpen: boolean,
    eventId: number,
    onCancle: (eventId: number) => void;
    onCreateEvent: (interactionEventVariables: InteractionEventVariables) => void;
}

const selectData = [
    'בית פרטי',
    'משרד',
    'תחבורה',
    'בית ספר',
    'בית חולים',
    'אחר'
]

const transportation = [
    'אוטובוס',
    'רכבת',
    'מונית',
    'טיסה',
    'הסעות',
    'רכב פרטי'
]

const school = [
    'יסודי',
    'חטיבת ביניים',
    'תיכון'
]

const hospitals = [
    'איכילוב',
    'תל השומר',
    'הדסה'
]

const otherInstitutions = [
    'גן ילדים',
    'מוסד אקדמאי',
    'מוסד רפואי',
    'מוסד גריאטרי'
]

// טרם
// מד"א
// אחר
// כנסייה
// בית כנסת
// מסגד
// מקווה
// אחר
// בית עלמין (חוץ מדקירה על המפה)
// אולם אירועים
// גן אירועים
// בית מלון
// מגרש ספורט
// אולם ספורט
// חדר כושר
// מוזיאון/גלריה

const defaultTime : string = '00:00';

const newConactEventTitle = 'יצירת מקום/מגע חדש'

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { isOpen, eventId, onCancle, onCreateEvent } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [canCreateEvent, setCanCreateEvent] = React.useState<boolean>(false);
    const [placeType, setPlaceType] = React.useState<string>(selectData[0]);
    const [eventStartTime, setEventStartTime] = React.useState<string>();
    const [eventEndTime, setEventEndTime] = React.useState<string>();
    const [canBeExported, setCanBeExported] = React.useState<boolean>(false);
    const [transportationType, setTransportationType] = React.useState<string>(transportation[0]);
    const [schoolType, setSchoolType] = React.useState<string>(school[0]);
    const [hospital, setHospital] = React.useState<string>(hospitals[0]);
    const [otherInstitution, setOtherInstitutions] = React.useState<string>(otherInstitutions[0]);

    React.useEffect(() => {
        setCanCreateEvent(eventStartTime !== undefined && eventEndTime !== undefined);
    }, [eventStartTime, eventEndTime]);

    const onPlaceTypeChange = (event: React.ChangeEvent<any>) => setPlaceType(event.target.value);
    const onEventStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value);
    const onEventEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEventEndTime(event.target.value);
    const onCanBeExportedChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => setCanBeExported(val);
    const onTransportationTypeChange = (event: React.ChangeEvent<any>) => setTransportationType(event.target.value);
    const onSchoolTypeChange = (event: React.ChangeEvent<any>) => setSchoolType(event.target.value);
    const onHospotalChange = (event: React.ChangeEvent<any>) => setHospital(event.target.value);
    const onOtherInstitutionsChange = (event: React.ChangeEvent<any>) => setOtherInstitutions(event.target.value);

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newConactEventTitle}
            </DialogTitle>
            <DialogContent>
                <Grid className={formClasses.form} container justify='flex-start'>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='סוג אתר'>
                            <Select
                                value={placeType}
                                onChange={onPlaceTypeChange}
                                className={classes.formSelect}
                            >
                            {
                                selectData.map((placeName: string) => (
                                    <MenuItem key={placeName} value={placeName}>{placeName}</MenuItem>
                                ))
                            }
                            </Select>
                        </FormInput>
                    </div>
                    <Collapse in={placeType === 'בית פרטי'}>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='בית המתוחקר'>
                                    <Toggle 
                                        className={classes.toggle}
                                        value={canBeExported} 
                                        onChange={onCanBeExportedChange}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={5}>
                                <FormInput fieldName='כתובת'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={2}>
                                <FormInput fieldName='קומה'>
                                    <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                    </Collapse>
                    <Collapse in={placeType === 'משרד'}>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='שם המשרד'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={5}>
                                <FormInput fieldName='כתובת'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={2}>
                                <FormInput fieldName='קומה'>
                                    <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>                        
                    </Collapse>
                    <Collapse in={placeType === 'תחבורה'}>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='סוג תחבורה'>
                                <Select
                                    value={transportationType}
                                    onChange={onTransportationTypeChange}
                                    className={classes.formSelect}
                                >
                                {
                                    transportation.map((transpotOption: string) => (
                                        <MenuItem key={transpotOption} value={transpotOption}>{transpotOption}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormInput>
                        </div>
                        <Collapse in={transportationType === 'אוטובוס'}>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='קו'>
                                        <CircleTextField 
                                            value={'mock11111111111'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='חברה'>
                                        <CircleTextField 
                                            value={'mock11111111111'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='עיר מוצא'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תחנת עליה'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>     
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='עיר יעד'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תחנת ירידה'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>                        
                        </Collapse>
                        <Collapse in={transportationType === 'רכבת'}>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='עיר מוצא'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תחנת עליה'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>     
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='עיר יעד'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תחנת ירידה'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>                        
                        </Collapse>
                        <Collapse in={transportationType === 'טיסה'}>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='מספר טיסה'>
                                        <CircleTextField 
                                            value={'mock11111111111'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='חברת תעופה'>
                                        <CircleTextField 
                                            value={'mock11111111111'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תאריך יציאה'>
                                        <DatePick 
                                            type='date'
                                            value={'22/10/2017'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='תאריך חזרה'>
                                        <DatePick 
                                            type='date'
                                            value={'22/10/2017'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>     
                            <div className={formClasses.formRow}>
                                <Grid item xs={4}>
                                    <FormInput fieldName='ארץ מוצא'>
                                        <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormInput fieldName='עיר מוצא'>
                                        <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>     
                            <div className={formClasses.formRow}>
                                <Grid item xs={4}>
                                    <FormInput fieldName='ארץ יעד'>
                                        <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormInput fieldName='עיר יעד'>
                                        <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>                    
                        </Collapse>
                        <Collapse in={transportationType === 'הסעות'}>
                            <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='שם איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='טלפון איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                        </Collapse>
                    </Collapse>
                    <Collapse in={placeType === 'בית ספר'}>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='סוג בית ספר'>
                                    <Select
                                        value={schoolType}
                                        onChange={onSchoolTypeChange}
                                        className={classes.formSelect}
                                    >
                                    {
                                        school.map((schoolType: string) => (
                                            <MenuItem key={schoolType} value={schoolType}>{schoolType}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormInput>
                            </Grid>
                            <Grid item xs={3}>
                                <FormInput fieldName='כיתה'>
                                    <CircleTextField 
                                            value={'2'} 
                                            onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='שם המוסד'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={5}>
                                <FormInput fieldName='כתובת המוסד'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='שם איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='טלפון איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                    </Collapse>
                    <Collapse in={placeType === 'בית חולים'}>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='שם בית חולים'>
                                    <Select
                                        value={hospital}
                                        onChange={onHospotalChange}
                                        className={classes.formSelect}
                                    >
                                    {
                                        hospitals.map((hospitalName: string) => (
                                            <MenuItem key={hospitalName} value={hospitalName}>{hospitalName}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormInput>
                            </Grid>
                            <Grid item xs={3}>
                                <FormInput fieldName='מחלקה'>
                                    <CircleTextField 
                                        value={'2'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='כתובת'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='שם איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='טלפון איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                    </Collapse>
                    <Collapse in={placeType === 'אחר'}>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='סוג מוסד'>
                                <Select
                                    value={otherInstitution}
                                    onChange={onOtherInstitutionsChange}
                                    className={classes.formSelect}
                                >
                                {
                                    otherInstitutions.map((institutionType: string) => (
                                        <MenuItem key={institutionType} value={institutionType}>{institutionType}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormInput>
                        </div>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='שם מוסד'>
                                    <CircleTextField 
                                        value={'2'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={5}>
                                <FormInput fieldName='כתובת'>
                                    <CircleTextField 
                                        value={'mock11111111111'} 
                                        onChange={() => {}}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                                <Grid item xs={5}>
                                    <FormInput fieldName='שם איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput fieldName='טלפון איש קשר'>
                                        <CircleTextField 
                                                value={'2'} 
                                                onChange={() => {}}/>
                                    </FormInput>
                                </Grid>
                            </div>
                    </Collapse>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='משעה'>
                            <DatePick 
                                type='time'
                                value={eventStartTime || defaultTime}
                                onChange={onEventStartTimeChange}/>
                        </FormInput>
                        <FormInput fieldName='עד שעה'>
                            <DatePick 
                                type='time'
                                value={eventEndTime || defaultTime}
                                onChange={onEventEndTimeChange}/>
                        </FormInput>
                    </div>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='האם מותר להחצנה'>
                            <Toggle 
                                className={classes.toggle}
                                value={canBeExported} 
                                onChange={onCanBeExportedChange}/>
                            </FormInput>
                    </div>
                </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => onCancle(eventId)} 
                    color='default' 
                    className={classes.cancleButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    disabled={!canCreateEvent}
                    onClick={() => onCreateEvent({canBeExported, eventEndTime, eventStartTime, placeType})}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;