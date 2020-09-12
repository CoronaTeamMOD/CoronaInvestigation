import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabInitialContainer: {
        paddingTop: '2vh',
        height: '64vh'
    },
    personalInfoFieldContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '2vh'
    },
    fieldsMargin: {
        marginTop: '3vh'
    },
    rowContainer: {
        display: 'flex',
        marginTop: '3vh'
    },
    containerGrid: {
        padding: '0 3vw',
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
    selectWidth: {
        width: '7vw'
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
}));

export default useStyles;