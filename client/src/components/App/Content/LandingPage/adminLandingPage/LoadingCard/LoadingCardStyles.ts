import { makeStyles } from '@material-ui/core';

const useStyle = (width?: string, height?: string) => makeStyles({
    loadingSpinnerCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '1vw',
        width,
        height
    }
})

export default useStyle;