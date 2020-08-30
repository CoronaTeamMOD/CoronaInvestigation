import { makeStyles } from '@material-ui/styles'
import { Repeat } from '@material-ui/icons';

const useStyles = makeStyles({
    PersonalInfoFieldsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '2vw'
    },
    fieldsMargin: {
        marginTop: '3vh'
    },
    rowContainer: {
        display: 'flex',
        marginTop: '3vh'
    },
    container: {
        display: 'flex'
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,20vw)',
        gridTemplateRows: 'repeat(8,6vh)'
    },
    box1: {
        gridRowStart: '1',
        gridRowEnd: '2',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box2: {
        gridRowStart: '2',
        gridRowEnd: '3',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box3: {
        gridRowStart: '3',
        gridRowEnd: '4',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box4: {
        gridRowStart: '4',
        gridRowEnd: '5',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box5: {
        gridRowStart: '5',
        gridRowEnd: '6',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box6: {
        gridRowStart: '6',
        gridRowEnd: '7',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box7: {
        gridRowStart: '7',
        gridRowEnd: '8',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    },
    box8: {
        gridRowStart: '8',
        gridRowEnd: '9',
        gridColumnStart: '1',
        gridColumnEnd: '2',
        padding: '2vh 4vh'
    }
});

export default useStyles;