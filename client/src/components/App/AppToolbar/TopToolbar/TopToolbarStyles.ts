import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    rightToolbarSection: {
        display: 'flex',
        flexDirection: 'row',
    },
    logo: {
        height: '8vh',
    },
    systemName: {
        margin: '0.5vw'
    },
    centering: {
        alignSelf: 'center'
    }
});

export default useStyles;
