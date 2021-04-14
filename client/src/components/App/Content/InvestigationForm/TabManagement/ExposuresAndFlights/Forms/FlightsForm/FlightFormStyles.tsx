import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    inputRow: {
        alignItems: 'center',
        minWidth: '45vw',
        '&.MuiGrid-item': {
            paddingLeft: 0
        },
        '& .MuiFormLabel-root': {
            maxWidth: '100%',
            textAlign: 'left',
            marginTop: '-10px',
        },
    },
});

export default useStyles;