import React from 'react'
import { Grid , GridSize , Typography} from '@material-ui/core';

interface Props {
    containerSize : GridSize;
    title: string;
    content?: string;
    labelLengthMD : GridSize;
    labelLengthLG : GridSize;
}

const InteractionGridItem = (props: Props) => {
    const { containerSize , title , content , labelLengthMD , labelLengthLG} = props;
    return (
        <Grid container xs={containerSize} alignItems='center'>
            <Grid item md={labelLengthMD} lg={labelLengthLG}>
                <Typography variant='caption'>
                    {<b>{title + ':'}</b>}
                </Typography>
            </Grid>
            <Grid item xs='auto'>
                <Typography variant='caption'>
                    {content}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default InteractionGridItem;
