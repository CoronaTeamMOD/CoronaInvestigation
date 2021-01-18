import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    inputRow: {
        alignItems: 'center',
        minWidth: '45vw',
        '&.MuiGrid-item': {
            paddingLeft: 0
        }
    },
});

export default useStyles;
