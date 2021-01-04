import { makeStyles } from '@material-ui/core';

const useStyle = (width?: string, height?: string) => {
    const cardStyles = {
        borderRadius: '1vw',
        padding: '1vw',
        width,
        height
    };

    return makeStyles({
        loadingSpinnerCard: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...cardStyles
        },
        card: cardStyles
})}

export default useStyle;