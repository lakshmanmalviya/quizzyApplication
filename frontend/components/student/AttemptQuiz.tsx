import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuestionsRequest } from '@/redux/slices/questionSlice';
import { createResultRequest } from '@/redux/slices/resultSlice';
import { RootState } from '@/redux/store';
import styles from '@/styles/student/AttempQuiz.module.css';
import { Question, Result } from '@/types/types';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addIsSelectedFieldInOptions, fillIsSelectedAsTrueForClickedOption, giveQuizResult, shuffleArray, shuffleOptions } from '@/services/result';
import Loader from '../common/Loader';
import QuestionOptions from './cards/QuestionOptions';
import TimeCard from './cards/TimeCard';
import ConfirmModal from './modals/ConfirmModal';
import ResultModal from './modals/ResultModal';
import { Button } from '@mui/material';


const AttempQuiz: React.FC = () => {
  const { questions, questionLoading } = useAppSelector((state: RootState) => state.question);
  const { quiz } = useAppSelector((state: RootState) => state.quiz);
  const { result } = useAppSelector((state: RootState) => state.result);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const timeLeft = useRef<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questionsForAttempt, setQuestionsForAttempt] = useState<Question[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [resultData, setResultData] = useState<Result>({
    ...result,
    quizId: quiz.id,
    id: 0,
  });

  useEffect(() => {
    router.prefetch('/student/quizzes')
    dispatch(fetchQuestionsRequest("quizId=" + quiz.id + "&toggle=true"));
  }, [])

  useEffect(() => {
    let modifiedQuestions = addIsSelectedFieldInOptions(questions.content);
    modifiedQuestions = quiz.randomizeQuestions ? shuffleArray(modifiedQuestions) : modifiedQuestions;
    modifiedQuestions = shuffleOptions(modifiedQuestions);
    setQuestionsData(modifiedQuestions);
    setQuestionsForAttempt(modifiedQuestions);
    timeLeft.current = Number(quiz.timeLimit);
  }, [questions])

  const handleAnswerSelect = async (questionId: number, optionId: number) => {
    const updatedQuestions = fillIsSelectedAsTrueForClickedOption(questionsForAttempt, questionId, optionId);
    setQuestionsForAttempt([...updatedQuestions]);
  };

  const handlePrevClick = (): void => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = (): void => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.content.length - 1));
  };

  const takeTimeLeftFromCard = (time: number) => {
    if (time == 0)
      handleSubmitQuiz();
    timeLeft.current = time;
  }

  const handleSubmitQuiz = async () => {
    const calculatedResult = await giveQuizResult(quiz, questionsData, questionsForAttempt,
      quiz.timeLimit, timeLeft.current, resultData);
    setResultData(calculatedResult);
    localStorage.setItem('presentQuestions', JSON.stringify(questionsData))
    localStorage.setItem('attemptedQuestions', JSON.stringify(questionsForAttempt))
    dispatch(createResultRequest(calculatedResult));
    handleResultModalOpen();
    timeLeft.current = 0;
  };

  const handleResultModalOpen = () => {
    setResultModalOpen(true);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const clearSelectedOption = (questions: Question[], questionId: number): Question[] => {
    return questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map(option => {
            return {
              ...option,
              isSelected: false
            };
          })
        }
      }
      return question;
    });
  }

  const handleClear = (questionId: number) => {
    const updatedQuestions = clearSelectedOption(questionsForAttempt, questionId);
    setQuestionsForAttempt([...updatedQuestions]);
  }

  const gotoBack = () => {
    router.back();
  }

  return (
    <>
      {
        questionLoading == true ? <Loader /> :
          <>
            {resultModalOpen &&
              <ResultModal
                result={resultData}
              />
            }
            {
              <>
                {questionsForAttempt.length > 0 ? (
                  <div className={styles.quizContainer}>
                    <div className={styles.quizHeaderContainer}>
                      <div className={styles.quizFooterContainer}>
                        <div className={styles.footerItem}>
                          <button className={styles.previous} onClick={handlePrevClick}
                            disabled={currentQuestionIndex == 0}>
                            Previous
                          </button>
                        </div>
                        <div className={styles.footerItem}>
                          <button className={styles.next} onClick={handleNextClick}
                            disabled={currentQuestionIndex == questionsForAttempt.length - 1}
                          >
                            Next
                          </button>
                        </div>
                        <div className={styles.footerItem}>
                          <button className={styles.clearAll} onClick={() => { handleClear(questionsForAttempt[currentQuestionIndex].id) }}>
                            Clear
                          </button>
                        </div>
                        <div className={styles.footerItem} >
                          <button className={styles.submit} onClick={() => {
                            handleOpenConfirm();
                          }}>
                            Submit
                          </button>
                        </div>
                        <div className={styles.footerItem} >
                          {
                            timeLeft.current != 0 ?
                              < TimeCard
                                time={timeLeft.current}
                                takeTimeLeftFromCard={takeTimeLeftFromCard}
                              /> : ''
                          }
                        </div>
                      </div>
                    </div>

                    <div className={styles.questionSection}>
                      <QuestionOptions
                        question={questionsForAttempt[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                        index={currentQuestionIndex + 1}
                      />
                    </div>
                    {
                      openConfirm &&
                      <ConfirmModal
                        onClose={handleCloseConfirm}
                        confirm={handleSubmitQuiz}
                        text='Are you sure you want to submit the quiz?'
                        buttonName='Submit'
                      />
                    }
                  </div>
                ) :
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexDirection: 'column' }}>
                    <h1>No question is present or reloaded </h1>
                    <div>
                      <Button
                        onClick={gotoBack}
                        variant="outlined"
                        color="secondary"
                        startIcon={<ArrowBackIcon fontSize='small' />}
                        sx={{ textTransform: 'none', fontSize: '16px' }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                }
              </>
            }
          </>
      }
    </>
  );
};

export default AttempQuiz;
