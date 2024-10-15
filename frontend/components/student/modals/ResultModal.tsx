import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateResultState } from '@/redux/slices/resultSlice';
import { RootState } from '@/redux/store';
import { giveTime } from '@/services/CommonServices';
import { modalStyle } from '@/styles/CommonStyle.module';
import { Result } from '@/types/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ResultModalProps {
    result: Result;
}

const ResultModal: React.FC<ResultModalProps> = ({ result }) => {
    const { resultMessage, resultError } = useAppSelector((state: RootState) => state.result);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (resultMessage) {
            toast.success(resultMessage, { position: 'top-center', autoClose: 1000 });
        }
        if (resultError) {
            toast.error(resultError, { position: 'top-center' });
        }
        dispatch(updateResultState());
    }, [resultMessage, resultError, dispatch]);

    const navigateToFeedback = () => {
        router.replace('/student/quizzes/feedback');
    };

    const gotoBack = () => {
        router.back();
    };

    return (
        <>
            <Modal open={true}>
                <Box sx={{ ...modalStyle, borderRadius: '8px', padding: '20px', maxWidth: '600px', mx: 'auto' }}>

                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 2 }}>
                        Quiz Result
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Time spent: <strong>{giveTime(result.timeSpent)}</strong>
                            </Typography>

                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Correct Answers: <strong>{result.correctAnswers}</strong>
                            </Typography>

                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Incorrect Answers: <strong>{result.incorrectAnswers}</strong>
                            </Typography>

                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Total Questions: <strong>{result.totalQuestion}</strong>
                            </Typography>

                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Your Score: <strong>{result.score}</strong>
                            </Typography>

                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Total Score: <strong>{result.totalScore}</strong>
                            </Typography>
                            <Typography sx={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>
                                Result: <strong style={{ color: result.feedbackColor }}>{result.pass ? 'Passed' : 'Failed'}</strong>
                            </Typography>
                        </div>
                        <div>
                            <img
                                src={result.pass ? "/congrats.gif" : "/tried.gif"}
                                alt={result.pass ? "congratulations" : "better luck next time"}
                                width='100%'
                                height='100%'
                            />
                        </div>
                    </div>
                    <Typography sx={{ fontSize: '16px', color: result.feedbackColor }}>
                        <strong>{result.feedbackText}</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
                        <Button
                            onClick={gotoBack}
                            variant="outlined"
                            color="secondary"
                            startIcon={<ArrowBackIcon fontSize='small' />}
                            sx={{ textTransform: 'none', fontSize: '16px' }}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={navigateToFeedback}
                            variant="outlined"
                            color="secondary"
                            startIcon={<AssignmentIcon fontSize='small' />}
                            sx={{ textTransform: 'none', fontSize: '16px' }}
                        >
                            Check Answers
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ResultModal;
