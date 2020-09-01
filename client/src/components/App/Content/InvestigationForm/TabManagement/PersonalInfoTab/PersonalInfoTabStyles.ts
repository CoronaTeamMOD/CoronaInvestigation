import { makeStyles } from '@material-ui/styles'
import { Repeat } from '@material-ui/icons';

const useStyles = makeStyles({
    tabInitialPadding: {
        paddingTop: '2vh'
    },
    PersonalInfoFieldContainer: {
        display: 'flex',
        alignItems: 'center'
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
        maxHeight: 'fit-content'
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
        width: '18vw'
    },
    borderRadius: {
        borderRadius: '25px'
    },
    personalId: {
        width: '8vw',
        marginLeft: '0.5vw'
    },
    unsetFormControlMargin: {
        marginLeft: '0'
    },
    ageText: {
        maxWidth: '4vw'
    },
    inSuranceSelect: {
        width: '6vw'
    },
    selectPlaceHolder: {
        left: 'unset',
        fontSize: 13
    }
});

export default useStyles;