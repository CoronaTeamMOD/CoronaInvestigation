import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    detailsItemField: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-3vw',
        },
        marginRight: '2vw',
    },
    detailsTextField: {
        '@media screen and (min-width: 1870px)': {
            marginLeft: '-2.5vw',
        }
    },
});

export default  useStyles;
