import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createBookmarkRequest, resetBookmarkMessage, } from '@/redux/slices/bookmarkSlice';
import { updateQuizId } from '@/redux/slices/propSlice';
import { fetchQuizzesRequest, updateQuiz } from '@/redux/slices/quizSlice';
import { RootState } from '@/redux/store';
import { capitalizeWords, giveDate, giveSeverityWithColor, giveTime, isBase64 } from '@/services/CommonServices';
import styles from '@/styles/student/ListEducatorCatQuiz.module.css';
import { Filters, Quiz } from '@/types/types';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import NotAvailable from '../common/NotAvailable';
import QuizFiltersCard from '../educator/cards/QuizFiltersCard';
import Pagination from '../educator/Pagination';
import ConfirmModal from './modals/ConfirmModal';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const ListAllQuiz: React.FC = () => {
  const { categoryId, creatorId, quizBy, forWhat } = useAppSelector((state: RootState) => state.props);
  const { bookmarkMessage, bookmarkError } = useAppSelector((state: RootState) => state.bookmark)
  const { quizzes, quizLoading } = useAppSelector((state: RootState) => state.quiz);
  const [quizzesData, setQuizzesData] = useState<Quiz[]>([...quizzes.content]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = new URLSearchParams();
  const [filters, setFilters] = useState<Filters>({ page: 0, size: 10 });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [bookmarkId, setBookmarkId] = useState<number>(-1);

  useEffect(() => {
    prepareParams();
    dispatch(fetchQuizzesRequest(params.toString()));
  }, [dispatch])

  useEffect(() => {
    prepareParams();
    dispatch(fetchQuizzesRequest(params.toString()));
  }, [filters, dispatch, creatorId, categoryId]);

  useEffect(() => {
    setQuizzesData(quizzes.content);
  }, [quizzes]);

  const prepareParams = () => {
    if (forWhat == 'StudentEducator')
      params.set('creatorId', creatorId !== -1 ? creatorId.toString() : '');

    else if (forWhat == 'StudentCategory')
      params.set('categoryId', categoryId !== -1 ? categoryId.toString() : '');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined)
        params.set(key, value.toString());
    });
  }

  useEffect(() => {
    if (bookmarkMessage) {
      toast.success(bookmarkMessage, { position: 'top-center', autoClose: 1000 });
      dispatch(resetBookmarkMessage())
      updateBookmarkIcon();
    }

    if (bookmarkError) {
      toast.error(bookmarkError, { position: 'top-center' });
      dispatch(resetBookmarkMessage())
    }
  }, [bookmarkMessage, bookmarkError])

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

  const handleStartQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setOpen(true);
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
      page: 0,
      size: newRowsPerPage,
    })
  };

  const handleReset = () => {
    if (forWhat == 'StudentEducator') {
      setFilters({ page: 0, size: 10, creatorId: creatorId, categoryId: undefined, query: undefined });
    }
    else if (forWhat == 'StudentCategory') {
      setFilters({ page: 0, size: 10, creatorId: undefined, categoryId: categoryId, query: undefined });
    }
    else setFilters({ page: 0, size: 10, query: undefined });
  }

  const updateBookmarkIcon = () => {
    setQuizzesData((prevQuiz) =>
      prevQuiz.map((quiz: Quiz) => {
        if (quiz.id === bookmarkId) {
          return { ...quiz, isBookmarked: true };
        }
        return quiz;
      })
    );
  };

  const handleBookmarkClick = (quizId: number) => {
    dispatch(createBookmarkRequest({
      id: -1,
      quizId: quizId,
      isBookmarked: false,
    }))
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box className={styles.container}>
        <QuizFiltersCard
          applyFilters={applyFilters}
          resetFilters={handleReset}
          children={null}
          by={quizBy ?? ''}
        />
        {
          quizLoading == true ? <Loader />
            :
            <Box className={styles.cardsContainer}>
              {quizzesData.length === 0 && <NotAvailable />
              }
              <Box className={styles.cardContainer}>
                {quizzesData.map((quiz: Quiz) => (
                  <Card className={styles.card} key={quiz.id}
                  >
                    <CardActionArea>
                      <div style={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={isBase64(quiz.quizPic)}
                          alt={quiz.title}
                          sx={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <Box
                          onClick={() => {
                            handleBookmarkClick(quiz.id);
                            setBookmarkId(quiz.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            display: 'inline-block',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.7)',
                              top: '15px',
                            },
                          }}
                        >
                          {
                            quiz.isBookmarked == true ? <BookmarkIcon style={{ fontSize: '20px' }} /> : <BookmarkBorderIcon
                              style={{ fontSize: '20px' }}
                            />
                          }

                        </Box>
                      </div>
                      <CardContent>
                        <Tooltip title={quiz.title} placement="top"
                          enterDelay={300}
                          componentsProps={{
                            tooltip: {
                              className: styles.toolTip,
                            },
                          }}>
                          <Typography gutterBottom variant="h5" component="div" className={styles.cardTitle}>
                            {capitalizeWords(quiz.title)}
                          </Typography>
                        </Tooltip>
                        <Tooltip title={quiz.description} placement="top"
                          enterDelay={300}
                          componentsProps={{
                            tooltip: {
                              className: styles.toolTip,
                            },
                          }}>
                          <Typography variant="body2" className={styles.cardBio}>
                            {quiz.description}
                          </Typography>
                        </Tooltip>

                        <Typography variant="subtitle2" color="text.secondary">
                          Time Limit : {giveTime(quiz.timeLimit)}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                          Questions : {quiz.questions?.length}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                          Difficulty : <span style={{ color: giveSeverityWithColor(quiz).color }}>{quiz.severity}</span>
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" className={styles.cardInfo}>
                          Created on : {giveDate(quiz.createdAt)}
                        </Typography>

                        <div style={{ display: 'flex', justifyContent: 'center', }}>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor: 'green',
                              color: '#fff',
                              textTransform: 'none',
                            }}
                            onClick={() => { handleStartQuizClick(quiz) }}
                          >
                            Start Quiz
                          </Button>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
        }
        <Box className={styles.paginationContainer}>
          <Pagination
            page={filters.page ?? 0}
            count={quizzes.totalElements}
            rowsPerPage={filters.size ?? 10}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box >
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

export default ListAllQuiz;
