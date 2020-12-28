import { makeStyles } from '@material-ui/styles';

import { primaryBackgroundColor } from 'styles/theme';

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: '5vh 3vw',
        height: '93.5vh',
        backgroundColor: primaryBackgroundColor,
    },
    countyDisplayName: {
        fontSize: '1.5vw',
    },
    gridContainer: {
        paddingTop: '3vh',
    }
});

export default useStyles;
