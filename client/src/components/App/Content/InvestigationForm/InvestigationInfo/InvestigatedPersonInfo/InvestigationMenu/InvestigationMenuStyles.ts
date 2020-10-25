import { makeStyles } from '@material-ui/styles';
const ITEM_HEIGHT = 48;

const useStyles = makeStyles({
    menu: {
        maxHeight: ITEM_HEIGHT * 4.5,
        width: '23ch',
        borderRadius: '10px',
        flip: false,
        right: '2vw!important',
        top: '12vh!important',
    },
    menuItem: {
        justifyContent: 'space-between'
    }
});

export default useStyles;