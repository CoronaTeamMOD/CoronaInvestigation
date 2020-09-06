import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1vh'
    },
    rowAlignment: {
        display: 'flex',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    gridContainer: {
        margin: '0 5vh'
    },
    divider: {
        margin: '0 2.3vw'
    }
});

export default useStyle;