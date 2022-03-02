import { Box, Grid, TextField, Typography } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { useState } from "react";
import useStyles from "./PaginationStyles";

const Pagination = (props: Props) => {
    const { page, count, onPageChange } = props;
    const classes = useStyles();
    const [currentPage, setCurrentPage] = useState<string | null>(page.toString());
    return (
        <Grid container xs={12} spacing={1} direction='row' className={classes.paginationRow} >
            <Grid item xs='auto'>
                <Box>
                    <button
                        className={classes.arrowButton}
                        disabled={page == 1}
                        onClick={() => {
                            setCurrentPage((page - 1).toString());
                            onPageChange(page - 1);
                        }}
                    ><NavigateNext className={classes.arrowIcon} /></button>
                </Box>
            </Grid>
            <Grid item xs='auto'>
                <TextField
                    {...props}
                    variant="outlined"
                    name='page'
                    type='number'
                    size='small'
                    value={currentPage}
                    onChange={(event) => {
                        setCurrentPage(event.target.value);
                    }}
                    onKeyPress={event => {
                        event.key === 'Enter' &&
                        onPageChange(Number(currentPage))
                    }}
                    onBlur={() => {
                        if (currentPage != '')
                            onPageChange(Number(currentPage))
                    }}
                    className={classes.pageInput}
                />
            </Grid>
            <Grid item xs='auto'>
                <Box>
                    <button disabled={page == count}
                        className={classes.arrowButton}
                        onClick={() => {
                            setCurrentPage((page + 1).toString());
                            onPageChange(page + 1);
                        }}><NavigateBefore className={classes.arrowIcon} /></button>
                </Box>
            </Grid>
            <Grid item xs='auto'>
                <Typography className={classes.paginationLabel}> מתוך {count}</Typography>
            </Grid>
        </Grid>
    )
}

export default Pagination;

interface Props {
    page: number;
    count: number;
    onPageChange: (value: number) => void;
};
