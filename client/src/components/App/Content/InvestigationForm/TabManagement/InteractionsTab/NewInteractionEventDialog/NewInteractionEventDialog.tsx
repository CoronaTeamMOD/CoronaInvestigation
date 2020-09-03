import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Collapse } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import Address, { initAddress } from 'models/Address';

import useStyles from './NewInteractionEventDialogStyles';
import OfficeEventForm from './PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm, { grades } from './PlacesAdditionalForms/SchoolEventForm';
import HospitalEventForm, { hospitals } from './PlacesAdditionalForms/HospitalEventForm';
import DefaultPlaceEventForm from './PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from './PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm from './PlacesAdditionalForms/TransportationEventForm/TransportationEventForm';
import { InteractionEventVariables, InteractionEventVariablesProvider } from './InteractionEventVariables';
import useNewInteractionEventDialog from './useNewInteractionEventDialog';

const privateHouseLocationType : string = 'בית פרטי';
const officeLocationType : string = 'משרד';
const transportationLocationType : string = 'תחבורה';
const schoolLocationType : string = 'בית ספר';
const hospitalLocationType : string = 'בית חולים';

export interface Props {
    isOpen: boolean,
    closeDialog: () => void
}

const otherLocationTypes = [
    'טרם',
    'מד"א',
    'כנסייה',
    'בית כנסת',
    'מסגד',
    'מקווה',
    'בית עלמין',
    'אולם אירועים',
    'גן אירועים',
    'בית מלון',
    'מגרש ספורט',
    'אולם ספורט',
    'חדר כושר',
    'מוזיאון/גלריה',
    'גן ילדים',
    'מוסד אקדמאי',
    'מוסד רפואי',
    'מוסד גריאטרי'
]

const locationTypes = [
    privateHouseLocationType,
    officeLocationType,
    transportationLocationType,
    schoolLocationType,
    hospitalLocationType,
].concat(otherLocationTypes);

const defaultTime : string = '00:00';

const newConactEventTitle = 'יצירת מקום/מגע חדש'

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { isOpen, closeDialog } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const { createNewInteractionEvent } = useNewInteractionEventDialog({closeDialog});
    const [canCreateEvent, setCanCreateEvent] = React.useState<boolean>(false);

    const [locationType, setLocationType] = React.useState<string>('0');
    const [startTime, setStartTime] = React.useState<string>();
    const [endTime, setEndTime] = React.useState<string>();
    const [externalizationApproval, setExternalizationApproval] = React.useState<boolean>(false);
    const [investigationId, setInvestigationId] = React.useState<number>();
    const [locationName, setLocationName] = React.useState<string>();
    const [locationAddress, setLocationAddress] = React.useState<Address>(initAddress);
    const [trainLine, setTrainLine] = React.useState<string>();
    const [busLine, setBusLine] = React.useState<string>();
    const [flightNumber, setFlightNumber] = React.useState<string>();
    const [airline, setAirline] = React.useState<string>();
    const [busCompany, setBusCompany] = React.useState<string>();
    const [boardingStation, setBoardingStation] = React.useState<string>();
    const [boardingCountry, setBoardingCountry] = React.useState<string>();
    const [boardingCity, setBoardingCity] = React.useState<string>();
    const [endStation, setEndStation] = React.useState<string>();
    const [endCountry, setEndCountry] = React.useState<string>();
    const [endCity, setEndCity] = React.useState<string>();
    const [grade, setGrade] = React.useState<string | undefined>(grades[0]);
    const [buisnessContactName, setBuisnessContactName] = React.useState<string>();
    const [buisnessContactNumber, setBuisnessContactNumber] = React.useState<string>();
    const [hospitalDepartment, setHospitalDepartment] = React.useState<string>();
    
    React.useEffect(() => {
        setCanCreateEvent(startTime !== undefined && endTime !== undefined);
    }, [startTime, endTime]);

    React.useEffect(() => {
        resetLocationForm()
    }, [locationType]);

    const interactionEventVariables: InteractionEventVariables = React.useMemo(() => ({ 
            locationType,
            startTime,
            endTime,
            externalizationApproval,
            investigationId,
            locationName,
            locationAddress,
            trainLine,
            busLine,
            airline,
            flightNumber,
            busCompany,
            grade,
            boardingStation,
            boardingCountry,
            boardingCity,
            endStation,
            endCountry,
            endCity,
            buisnessContactName,
            buisnessContactNumber,
            hospitalDepartment,
            setLocationType,
            setStartTime,
            setEndTime,
            setExternalizationApproval,
            setInvestigationId,
            setLocationName,
            setLocationAddress,
            setTrainLine,
            setBusLine,
            setBusCompany,
            setAirline,
            setFlightNumber,
            setGrade,
            setBoardingStation,
            setBoardingCountry,
            setBoardingCity,
            setEndStation,
            setEndCountry,
            setEndCity,
            setBuisnessContactName,
            setBuisnessContactNumber,
            setHospitalDepartment
        }),
        [   
            locationType,
            startTime,
            endTime,
            externalizationApproval,
            investigationId,
            locationName,
            locationAddress,
            trainLine,
            busLine,
            airline,
            flightNumber,
            busCompany,
            grade,
            boardingStation,
            boardingCountry,
            boardingCity,
            endStation,
            endCountry,
            endCity,
            buisnessContactName,
            buisnessContactNumber,
            hospitalDepartment,
            setLocationType,
            setStartTime,
            setEndTime,
            setExternalizationApproval,
            setInvestigationId,
            setLocationName,
            setLocationAddress,
            setTrainLine,
            setBusLine,
            setBusCompany,
            setAirline,
            setFlightNumber,
            setGrade,
            setBoardingStation,
            setBoardingCountry,
            setBoardingCity,
            setEndStation,
            setEndCountry,
            setEndCity,
            setBuisnessContactName,
            setBuisnessContactNumber,
            setHospitalDepartment,
        ]
    )

    const resetLocationForm = () => {
        setLocationName(locationTypes[+locationType] === hospitalLocationType ? hospitals[0] : undefined);
        setLocationAddress(initAddress);
        setTrainLine(undefined);
        setBusLine(undefined);
        setBusCompany(undefined);
        setAirline(undefined);
        setFlightNumber(undefined);
        setGrade(grades[0]);
        setBoardingStation(undefined);
        setBoardingCountry(undefined);
        setBoardingCity(undefined);
        setEndStation(undefined);
        setEndCountry(undefined);
        setEndCity(undefined);
        setBuisnessContactName(undefined);
        setBuisnessContactNumber(undefined);
        setHospitalDepartment(undefined);
    }

    const onLocationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) =>
        setLocationType(event.target.value as string);

    const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setStartTime(event.target.value);
    const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEndTime(event.target.value);
    const onExternalizationApprovalChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => setExternalizationApproval(val);
    const onConfirm = () => createNewInteractionEvent({
        locationType: locationTypes[+locationType],
        startTime,
        endTime,
        externalizationApproval,
        investigationId,
        locationName,
        locationAddress,
        trainLine,
        busLine,
        airline,
        flightNumber,
        busCompany,
        grade: locationTypes[+locationType] === schoolLocationType ? grade : undefined,
        boardingStation,
        boardingCountry,
        boardingCity,
        endStation,
        endCountry,
        endCity,
        buisnessContactName,
        buisnessContactNumber,
        hospitalDepartment
    })

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newConactEventTitle}
            </DialogTitle>
            <InteractionEventVariablesProvider value={interactionEventVariables}>
                <DialogContent>
                    <Grid className={formClasses.form} container justify='flex-start'>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='סוג אתר'>
                                <CircleSelect
                                    value={locationType}
                                    onChange={onLocationTypeChange}
                                    className={classes.formSelect}
                                    options={locationTypes}
                                />
                            </FormInput>
                        </div>
                        <Collapse in={locationTypes[+locationType] === privateHouseLocationType}>
                            <PrivateHouseEventForm/>
                        </Collapse>
                        <Collapse in={locationTypes[+locationType] === officeLocationType}>
                            <OfficeEventForm/>                        
                        </Collapse>
                        <Collapse in={locationTypes[+locationType] === transportationLocationType}>
                            <TransportationEventForm onSubTypeChange={resetLocationForm}/>                        
                        </Collapse>
                        <Collapse in={locationTypes[+locationType] === schoolLocationType}>
                            <SchoolEventForm/>                        
                        </Collapse>
                        <Collapse in={locationTypes[+locationType] === hospitalLocationType}>
                            <HospitalEventForm/>
                        </Collapse>
                        <Collapse in={otherLocationTypes.includes(locationTypes[+locationType])}>
                            <DefaultPlaceEventForm />
                        </Collapse>
                        <div className={formClasses.formRow}>
                            <Grid item xs={5}>
                                <FormInput fieldName='משעה'>
                                    <DatePick 
                                        type='time'
                                        value={startTime || defaultTime}
                                        onChange={onStartTimeChange}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={5}>
                                <FormInput fieldName='עד שעה'>
                                    <DatePick 
                                        type='time'
                                        value={endTime || defaultTime}
                                        onChange={onEndTimeChange}/>
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='האם מותר להחצנה'>
                                <Toggle 
                                    className={classes.toggle}
                                    value={externalizationApproval} 
                                    onChange={onExternalizationApprovalChange}/>
                                </FormInput>
                        </div>
                    </Grid>
                </DialogContent>
            </InteractionEventVariablesProvider>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => closeDialog()} 
                    color='default' 
                    className={classes.cancleButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    disabled={!canCreateEvent}
                    onClick={onConfirm}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;