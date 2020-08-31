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
        padding: '2vh 3vw'
    },
    borderRadius: {
        borderRadius: '2px'
    }
});

export default useStyles;