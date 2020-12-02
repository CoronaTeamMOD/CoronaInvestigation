import { makeStyles } from '@material-ui/core';

import theme from 'styles/theme';

const useStyle = (isWide: boolean) => makeStyles({
    button: {
        display: 'flex',
        flexDirection: 'column',
        height: '5vh'
    },
    icon: {
        color: theme.palette.primary.main
    },
    disabled: {
        color: 'rgba(0, 0, 0, 0.26)'
    }
});

export default useStyle;