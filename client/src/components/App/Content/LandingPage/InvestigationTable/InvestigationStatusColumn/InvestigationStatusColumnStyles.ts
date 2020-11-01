import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    columnWrapper: {
        display: 'flex'
    },
    openInvestigatonIcon: {
        margin: '0 0.5vw'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
}));

export default useStyles;