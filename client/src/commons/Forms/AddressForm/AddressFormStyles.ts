import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
    cancelWhiteSpace: {
        marginLeft: '-4vw',
        '@media screen and (max-width: 1750px)': {
            marginLeft: '-2vw'
        }
    }
});

export default useStyle;