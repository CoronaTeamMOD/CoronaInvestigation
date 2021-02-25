import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    comment : {
        fontSize: '0.9rem',
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        whiteSpace: 'normal',
        overflow: 'hidden',
        marginRight: 0,
        minWidth: '150px',
    }
}));

export default useStyles;
