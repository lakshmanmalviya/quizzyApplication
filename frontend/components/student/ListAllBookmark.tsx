import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteBookmarkRequest, fetchBookmarksRequest, resetBookmarkMessage } from '@/redux/slices/bookmarkSlice';
import { updateQuiz } from '@/redux/slices/quizSlice';
import { RootState } from '@/redux/store';
import { capitalizeWords, giveDate, giveSeverityWithColor, giveTime, isBase64 } from '@/services/CommonServices';
import styles from '@/styles/student/ListEducatorCatQuiz.module.css';
import { Bookmark, Filters, Quiz } from '@/types/types';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { updateQuizId } from '@/redux/slices/propSlice';
import Loader from '../common/Loader';
import NotAvailable from '../common/NotAvailable';
import QuizFiltersCard from '../educator/cards/QuizFiltersCard';
import Pagination from '../educator/Pagination';
import ConfirmModal from './modals/ConfirmModal';


const ListAllBookmark: React.FC = () => {
    const { bookmarkMessage, bookmarkError, bookmarks, bookmarkLoading } = useAppSelector((state: RootState) => state.bookmark)
    const [bookmarksData, setBookmarksData] = useState<Bookmark[]>([...bookmarks.content]);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = new URLSearchParams();
    const [filters, setFilters] = useState<Filters>({ page: 0, size: 10 });
    const [open, setOpen] = useState<boolean>(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        prepareParams();
        dispatch(fetchBookmarksRequest(params.toString()));
    }, [])

    useEffect(() => {
        prepareParams();
        dispatch(fetchBookmarksRequest(params.toString()));
    }, [filters]);

    useEffect(() => {
        if (bookmarkMessage) {
            toast.success(bookmarkMessage, { position: 'top-center', autoClose: 1000 });
        }
        if (bookmarkError) {
            toast.error(bookmarkError, { position: 'top-center' });
        }
        dispatch(resetBookmarkMessage())
    }, [bookmarkMessage, bookmarkError])

    useEffect(() => {
        setBookmarksData(bookmarks.content);
    }, [bookmarks])

    const prepareParams = () => {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.set(key, value.toString());
            }
        });
    }

    const handleClose = () => setOpen(false);

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

    const handleRemoveBookmark = (id: number) => {
        dispatch(deleteBookmarkRequest(id))
    }

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
            page: 0,
            size: newRowsPerPage,
        })
    };

    const handleReset = () => {
        setFilters({ page: 0, size: 10 });
    }

    return (
        <>
            <Box className={styles.container}>
                <QuizFiltersCard
                    applyFilters={applyFilters}
                    resetFilters={handleReset}
                    children={null}
                    by="Bookmark"
                />
                {
                    bookmarkLoading == true ? <Loader /> :
                        <Box className={styles.cardsContainer}>
                            {bookmarksData.length === 0 && <NotAvailable />
                            }
                            <Box className={styles.cardContainer}>
                                {bookmarksData.map((bookmark: Bookmark) => (
                                    <Card className={styles.card} key={bookmark.id}
                                    >
                                        <CardActionArea>
                                            <div style={{ position: 'relative' }}>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={isBase64(bookmark.quiz?.quizPic)}
                                                    alt={bookmark.quiz?.title}
                                                    sx={{ objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                                <Box
                                                    onClick={() => handleRemoveBookmark(bookmark.id)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        right: '10px',
                                                        display: 'inline-block',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.5)',
                                                        },
                                                    }}
                                                >
                                                    <BookmarkRemoveIcon
                                                        style={{ fontSize: '20px', color: 'red' }}
                                                    />
                                                </Box>
                                            </div>
                                            <CardContent>
                                                <Tooltip title={bookmark.quiz?.title} placement="top"
                                                    enterDelay={300}
                                                    componentsProps={{
                                                        tooltip: {
                                                            className: styles.toolTip,
                                                        },
                                                    }}>
                                                    <Typography gutterBottom variant="h5" component="div" className={styles.cardTitle}>
                                                        {capitalizeWords(bookmark.quiz?.title ?? '')}
                                                    </Typography>
                                                </Tooltip>
                                                <Tooltip title={bookmark.quiz?.description} placement="top"
                                                    enterDelay={300}
                                                    componentsProps={{
                                                        tooltip: {
                                                            className: styles.toolTip,
                                                        },
                                                    }}>
                                                    <Typography variant="body2" className={styles.cardBio}>
                                                        {bookmark.quiz?.description ?? ''}
                                                    </Typography>
                                                </Tooltip>

                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Time Limit : {giveTime(bookmark.quiz?.timeLimit ?? 0)}
                                                </Typography>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Questions : {bookmark.quiz?.questions?.length}
                                                </Typography>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Difficulty : <span style={{ color: giveSeverityWithColor(bookmark.quiz).color }}>{bookmark.quiz?.severity}</span>
                                                </Typography>
                                                <Typography variant="subtitle2" color="text.secondary" className={styles.cardInfo}>
                                                    Bookmarked on : {giveDate(bookmark.createdAt ?? '')}
                                                </Typography>
                                            </CardContent>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        backgroundColor: 'green',
                                                        color: '#fff',
                                                        textTransform: 'none',
                                                    }}
                                                    onClick={() => { handleStartQuizClick(bookmark.quiz ?? undefined) }}
                                                >
                                                    Attempt
                                                </Button>
                                            </div>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                }
                <Box className={styles.paginationContainer}>
                    <Pagination
                        page={filters.page ?? 0}
                        count={bookmarks.totalElements}
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
                    text='Are you sure you want to start ?'
                    buttonName='Start'
                />
            }
        </>
    );
};

export default ListAllBookmark;
