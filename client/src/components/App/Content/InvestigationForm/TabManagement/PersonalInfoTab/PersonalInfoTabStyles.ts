import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Repeat } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabInitialContainer: {
        paddingTop: '2vh',
        overflowY: 'scroll',
        height: '64vh'
    },
    PersonalInfoFieldContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    personalInfoLastFieldContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '1vh'
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
    selectWidth: {
        width: '7vw'
    },
    selectPlaceHolder: {
        left: 'unset',
        fontSize: 13
    },
    institutionName: {
        width: '10vw'
    }
}));

export default useStyles;