import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    tabInitialContainer: {
        padding: '2vh',
        maxHeight: '64vh'
    },
    addContactWrapper: {
        padding: '12px 0'
    },
    spacedOutAddress: {
        marginRight: '4vw',
        '@media screen and (max-width: 1700px)': {
            marginRight: '2vw',
        },
    },
    homeAddressItem: {
        '@media screen and (max-width: 1700px)': {
            marginRight: '2vw',
            marginLeft: '-2vw',
        }
    },
    personalInfoFieldContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '2vh',
        '@media screen and (min-width: 1870px)': {
            marginRight: '-6vw'
        },
        '@media screen and (max-width: 1000px)': {
            marginRight: '0.5vw',
        },
        marginRight: '-3vw',
    },
    fieldsMargin: {
        marginTop: '3vh'
    },
    rowContainer: {
        display: 'flex',
        marginTop: '3vh'
    },
    containerGrid: {
        maxWidth: '100vw',
        height: '9vh'
    },
    selectReason: {
        width: '10vw',
        marginLeft: '0.5vw'
    },
    checkboxSize: {
        width: 20,
        height: 20,
    },
    fontSize15: {
        fontSize: 15,
    },
    arrowToleft: {
        right: 'unset',
        left: '0px',
        paddingRight: '0px'
    },
    placeHolder: {
        left: 'unset'
    },
    writeReason: {
        width: '22vw',
        marginLeft: '1vw'
    },
    textFieldWithLabel: {
        width: '8vw',
        marginLeft: '0.5vw'
    },
    unsetFormControlMargin: {
        marginLeft: '0'
    },
    ageText: {
        maxWidth: '4vw'
    },
    selectPlaceHolder: {
        left: 'unset',
        fontSize: 13
    },
    institutionName: {
        width: '10vw'
    },
    relevantOccupationselect: {
        marginBottom: '3vh'
    },
    address: {
        width: '13vw',
    },
    circleSelect: {
        paddingTop: 'unset'
    },
    responsiveOccupation: {
        '@media screen and (max-width: 950px)': {
            marginLeft: '5vw',
        },
        marginRight: '-7vw'
    },
    contactDetailsStub: {
        margin: '10px 15px 10px 0'
    },
    notchedOutline: {
        borderWidth: '1px',
        borderColor: '#FFC90E !important'
    },
    markComplexity: {
        
    },
    '& .MuiInputLabel-root': {
        backgroundColor : 'white'
    },
    occupation: {
        display: 'flex',
        flexDirection: 'row',
    },
    complexIconOnOccupation: {
        marginTop: '5%',
    },
    gradeInput: {
        maxWidth: '5vw',
        '& .MuiInputLabel-formControl.Mui-error': {
            fontSize: '1.1vw',
            top: '-0.8vh'
        }
    },
    heightendTextField: {
        height: '3.99vh',
        '@media screen and (max-height: 950px)': {
            height: '5.9vh'
        },
    },
    otherTextField: {
        width: '100%',
        '&.MuiOutlinedInput-root': {
            minHeight: '43px'
        }
    },
    addPersonButton: {
        padding: '0',
        marginLeft: '2vw',
    },
    alignRight: {
        marginLeft: '-9vw',
    }
});

export default useStyles;
