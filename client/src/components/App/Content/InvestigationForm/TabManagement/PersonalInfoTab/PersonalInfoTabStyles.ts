import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabInitialContainer: {
        padding: '2vh',
        height: '64vh'
    },
    personalInfoItem: {
        marginLeft: '-5vw',
        '@media screen and (max-width: 1700px)': {
            marginRight: '2vw',
        },
    },
    spacedOutAddress: {
        marginRight: '5vw'
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
    },
    phoneInput: {
        minWidth: '15vw',
    },
    floorInput: {
        minWidth: '15vw',
    },
    houseNumInput: {
        minWidth: '15vw',
        marginLeft: '8vw'
    }
}));

export default useStyles;