import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    dialogPaper: {
        width: '40vw',
        minHeight: '25vh',
        borderRadius: '25px',
    },
    title: {
       display: 'flex',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
        alignItems: 'center',
    },
});

export default useStyles;