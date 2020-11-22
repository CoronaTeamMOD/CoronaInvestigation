import { makeStyles } from '@material-ui/core';

import theme from 'styles/theme';

const useStyle = (isWide: boolean) => makeStyles({
    card: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: '6vh',
        position: 'fixed',
        left: '40vw',
        width: 'fit-content',
        bottom: '1.8vh',
        height: isWide ? '6vh' : '8vh'
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '50%',
        height: isWide ? '6vh' : '8vh',
        width: isWide ? '6vh' : '8vh',
        color: 'white',
        '& > p': {
            fontSize: isWide ? '1.5vh': '2vh'
        }
    },
    closeButton: {
        marginRight: '1vw'
    }
});

export default useStyle;