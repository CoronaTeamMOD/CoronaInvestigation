import { makeStyles } from '@material-ui/styles'
import { Repeat } from '@material-ui/icons';

const useStyles = makeStyles({
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
        padding: '2vh 3vw',
        maxWidth: '120vw',
        maxHeight: '9vh'
    },
    selectReason: {
        width: '10vw',
        marginLeft: '1vw'
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
    }
});

export default useStyles;