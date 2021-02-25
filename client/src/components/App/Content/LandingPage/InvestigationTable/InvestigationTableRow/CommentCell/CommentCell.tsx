import React, { useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import useStyles from './commentCellStyles';

const CommentCell = (props: Props) => {
    const { comment } = props;
    const [readMore, setReadMore] = useState<boolean>(false);
    const clampLines = readMore ? 'unset' : 3;
    const classes = useStyles();

    return (
        <>
        <Typography className={classes.comment} style={{WebkitLineClamp : clampLines}}>
            { comment }
        </Typography>
        {/* {comment && <Button onClick={(e) => {
            e.stopPropagation();
            setReadMore(true)
        }}>עוד?</Button>} */}
        </>
    )
}


interface Props {
    comment: string;
}

export default CommentCell
