import { Box, Grid, TextField, Typography } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { useState } from "react";
import useStyles from "./PaginationStyles";

const Pagination = (props: Props) => {
    const { page, count, onPageChange } = props;
    const classes = useStyles();
    const [currentPage, setCurrentPage] = useState<string | null>(page.toString());
    
    const changePage = (page: number ) => {
        if (page > count ){
            setCurrentPage(count.toString());
            onPageChange(count);                             
        }
        else if (page < 1) {
            setCurrentPage((1).toString());
            onPageChange(1);
        } 
        else {
            setCurrentPage(page.toString());
            onPageChange(page);
        }
    }  

    return (
        <Grid container xs={12} spacing={1} direction='row' className={classes.paginationRow} >
            <Grid item xs='auto'>
                <Box>
                    <button
                        className={classes.arrowButton}
                        disabled={page == 1}
                        onMouseDown={() => {
                            let currentPageNumber = Number(currentPage)
                            changePage(currentPageNumber-1);
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
                         (event.key === 'Enter') && changePage(Number(currentPage))
                    }}
                    onBlur={() => {
                        if (currentPage != '')
                            changePage(Number(currentPage))
                    }}
                    className={classes.pageInput}
                />
            </Grid>
            <Grid item xs='auto'>
                <Box>
                    <button disabled={page == count}
                        className={classes.arrowButton}
                        onMouseDown={() => {
                            let currentPageNumber = Number(currentPage);
                            changePage(currentPageNumber+1);
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
