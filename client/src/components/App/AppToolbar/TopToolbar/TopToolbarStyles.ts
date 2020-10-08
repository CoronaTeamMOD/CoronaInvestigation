import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    logoTitle: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    }
});

export default useStyles;
