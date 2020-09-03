import { makeStyles } from '@material-ui/styles';

import { primaryBackgroundColor } from 'styles/theme';

const useStyle = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '84vh',
        width: '100vw',
        zIndex: 9999,
        position: 'absolute',
        top: '9vh',
        backgroundColor: primaryBackgroundColor,
        opacity: 0.8
    }
});

export default useStyle;