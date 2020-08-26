import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    systemName: {
        display: 'flex',
        flexDirection: 'row',
    },
    logo: {
        height: '3vh',
    }
});

export default useStyles;
