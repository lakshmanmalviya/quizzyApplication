import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateQuizId } from '@/redux/slices/propSlice';
import { updateQuiz } from '@/redux/slices/quizSlice';
import { fetchResultsRequest } from '@/redux/slices/resultSlice';
import { RootState } from '@/redux/store';
import { giveDate, giveTime } from '@/services/CommonServices';
import styles from '@/styles/student/ListEducatorCatQuiz.module.css';
import { Filters, Quiz, Result } from '@/types/types';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import NotAvailable from '../common/NotAvailable';
import Pagination from '../educator/Pagination';
import ResultFiltersCard from './cards/ResultsFiltersCard';
import ConfirmModal from './modals/ConfirmModal';

const ListAllResult: React.FC = () => {
    const { results, resultLoading } = useAppSelector((state: RootState) => state.result);
    const [resultsData, setResultsData] = useState<Result[]>([...results.content]);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = new URLSearchParams();
    const [filters, setFilters] = useState<Filters>({ page: 0, size: 10 });
    const [open, setOpen] = useState<boolean>(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        prepareParams();
        dispatch(fetchResultsRequest(params.toString()));
    }, [dispatch]);

    useEffect(() => {
        prepareParams();
        dispatch(fetchResultsRequest(params.toString()));
    }, [filters, dispatch]);

    useEffect(() => {
        setResultsData(results.content);
    }, [results]);

    const prepareParams = () => {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.set(key, value.toString());
            }
        });
    }

    const startQuizConfirmed = () => {
        if (selectedQuiz && !Boolean(selectedQuiz.questions?.length ?? 0 <= 0)) {
            toast.error("Can't start the quiz as it has zero questions", { position: 'top-center' });
        } else if (selectedQuiz) {
            dispatch(updateQuizId(selectedQuiz.id));
            dispatch(updateQuiz(selectedQuiz));
            router.push('/student/quizzes/start');
        }
        handleClose();
    };

    const handleStartQuizClick = (quiz: Quiz | undefined) => {
        if (quiz) {
            setSelectedQuiz(quiz);
            setOpen(true);
        }
    };

    const applyFilters = (newFilters: Filters) => {
        setFilters({ ...newFilters, page: 0 });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setFilters({
            ...filters,
            page: newPage,
        })
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setFilters({
            ...filters,
            size: newRowsPerPage,
            page: 0,
        })
    };

    const resetFilters = () => {
        setFilters({ page: 0, size: 10 });
    }

    const handleClose = () => setOpen(false);

    return (
        <>
            <Box className={styles.container}>
                <ResultFiltersCard
                    applyFilters={applyFilters}
                    resetFilters={resetFilters}
                />
                {
                    resultLoading == true ? <Loader /> :
                        <Box className={styles.cardsContainer}>
                            {resultsData.length === 0 && <NotAvailable />}
                            <Box className={styles.cardContainer} sx={{ marginTop: '10px' }}>
                                {resultsData.map((result: Result) => (
                                    <Box sx={{ p: 4, backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: 2, marginTop: '5px' }} key={result.id}>
                                        <Typography variant="h5" gutterBottom>
                                            Result Details : {result.quiz?.title}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Score:</strong> {result.score}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Total Score:</strong> {result.totalScore}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Time Spent: </strong>{giveTime(result.timeSpent)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Completed:</strong> {result.isCompleted ? 'Yes' : 'No'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Correct Answers:</strong> {result.correctAnswers}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Incorrect Answers:</strong> {result.incorrectAnswers}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Total Questions:</strong> {result.totalQuestion}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Attempted:</strong> {result.timesTaken} Times
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Last Attempted On:</strong> {giveDate(result.createdAt ?? '')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Result:</strong> {result.pass ? 'Pass' : 'Fail'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Button
                                                    onClick={() => { handleStartQuizClick(result.quiz ?? undefined) }}>
                                                    <strong>re-attempt</strong>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                }
                <Box className={styles.paginationContainer}>
                    <Pagination
                        page={filters.page ?? 0}
                        count={results.totalElements}
                        rowsPerPage={filters.size ?? 10}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Box>
            {
                open &&
                <ConfirmModal
                    onClose={handleClose}
                    confirm={startQuizConfirmed}
                    text='Are you sure you want to re-attempt ?'
                    buttonName='Attempt'
                />
            }
        </>

    );
};

export default ListAllResult;
