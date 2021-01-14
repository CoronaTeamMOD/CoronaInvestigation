import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    tabInitialContainer: {
        padding: '2vh',
        height: '64vh'
    },
    personalInfoItem: {
        marginLeft: '-4vw',
        '@media screen and (max-width: 1700px)': {
            marginRight: '2vw',
        },
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
    contactDescription: {
        marginLeft: '1vw',
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
    phoneInput: {
        minWidth: '15vw',
    },
    markComplexity: {
        border: 'solid #FFC90E',
        borderRadius: 24,
    },
    occupation: {
        display: 'flex',
        flexDirection: 'row',
    },
    complexIconOnOccupation: {
        marginTop: '5%',
    },
    gradeInput: {
        width: '7vw'
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
            height: '42px'
        }
    }
});

export default useStyles;
