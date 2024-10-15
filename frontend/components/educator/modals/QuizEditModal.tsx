import { useAppDispatch } from '@/redux/hooks';
import { updateQuizRequest } from '@/redux/slices/quizSlice';
import { buttonStyle, modalStyle } from '@/styles/CommonStyle.module';
import styles from '@/styles/EditUserModal.module.css';
import { Quiz, Severity } from '@/types/types';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import style from '@/styles/educator/CatQuizQuestionRow.module.css';
import { checkIsBase64Icon, isBase64 } from '@/services/CommonServices';

interface QuizEditModalProps {
    quiz: Quiz;
    onClose: () => void;
}

const QuizEditModal: React.FC<QuizEditModalProps> = ({ quiz, onClose }) => {
    const dispatch = useAppDispatch();
    const [quizData, setQuizData] = useState<Quiz>({ ...quiz, timeLimit: Math.round(quiz.timeLimit / 60) });
    const [disable, setDisable] = useState<boolean>(true);

    const [errors, setErrors] = useState({
        title: '',
        timeLimit: '',
        description: '',
        pass: '',
    });

    const validateForm = (): boolean => {
        let valid = true;
        let titleError = '', timeLimitError = '', descriptionError = '', passError = '';

        setQuizData({
            ...quizData,
            title: quizData.title.trim(),
            description: quizData.description.trim(),
        })

        if (!quizData.title.trim()) {
            titleError = "Title is required.";
            valid = false;
        } else if (quizData.title.trim().length < 3 || quizData.title.trim().length > 100) {
            titleError = "Title should be between 3 and 100 characters.";
            valid = false;
        }
        else if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(quizData.title.trim())) {
            titleError = 'Title should start with a letter and contain only letters, numbers, and spaces.';
            valid = false;
        }

        if (quizData.timeLimit <= 0 || quizData.timeLimit > 300) {
            timeLimitError = 'Time Limit must be between 1 and 300 minutes.';
            valid = false;
        }

        if (quizData.pass <= 10 || quizData.pass > 100) {
            passError = 'Passing percentage must be between 10 and 100 .';
            valid = false;
        }

        if (!quizData.description.trim()) {
            descriptionError = "Description is required.";
            valid = false;
        } else if (quizData.description.trim().length < 10 || quizData.description.trim().length > 255) {
            descriptionError = "Description should be between 10 and 255 characters.";
            valid = false;
        }

        setErrors({
            title: titleError,
            timeLimit: timeLimitError,
            description: descriptionError,
            pass: passError,
        });

        return valid;
    };

    const handleChange = (e: SelectChangeEvent<number | Severity> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Quiz) => {
        setDisable(false);
        const value = field === 'randomizeQuestions' ? (e.target as HTMLInputElement).checked : e.target.value;
        setQuizData(prevQuiz => ({
            ...prevQuiz,
            [field]: value,
        }));
    };

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setDisable(true);
            dispatch(updateQuizRequest(quizData));
        }
    };

    const handleQuizPictureChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDisable(false);
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            convertImageToBase64String(file);
        }
    };

    const convertImageToBase64String = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = (reader.result as string).replace('jpeg', 'png');
            setQuizData((quizData) => ({
                ...quizData,
                quizPic: result,
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <Modal open={true}>
                <Box sx={modalStyle} className={styles.modalBox}>
                    <Typography variant="h6" component="h2">
                        Edit Quiz
                    </Typography>
                    <form onSubmit={handleSave} autoComplete="off">
                        <FormControl fullWidth margin="normal" variant="outlined" size="small" className={style.formControl} sx={{ marginLeft: "20px" }}>
                            <InputLabel>Severity</InputLabel>
                            <Select
                                name="severity"
                                value={quizData.severity as Severity}
                                onChange={(e) => handleChange(e, 'severity')}
                                label="severity"
                            >
                                <MenuItem value={Severity.HARD}>Hard</MenuItem>
                                <MenuItem value={Severity.MEDIUM}>Medium</MenuItem>
                                <MenuItem value={Severity.BEGINNER}>Beginner</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Title"
                            fullWidth
                            value={quizData.title}
                            onChange={(e) => handleChange(e, 'title')}
                            margin="normal"
                            size='small'
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={quizData.description}
                            onChange={(e) => handleChange(e, 'description')}
                            margin="normal"
                            size='small'
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                        />
                        <TextField
                            label="Time Limit (in minutes)"
                            name="timeLimit"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={quizData.timeLimit}
                            onChange={(e) => handleChange(e, 'timeLimit')}
                            size='small'
                            error={Boolean(errors.timeLimit)}
                            helperText={errors.timeLimit}
                        />
                        <TextField
                            label="Passing percentage"
                            name="pass"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={quizData.pass}
                            onChange={(e) => handleChange(e, 'pass')}
                            size='small'
                            error={Boolean(errors.pass)}
                            helperText={errors.pass}
                        />
                        <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="quiz-pic-upload"
                                onChange={handleQuizPictureChange}
                            />
                            <label htmlFor="quiz-pic-upload">
                                <img
                                    src={checkIsBase64Icon(quizData.quizPic)}
                                    style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                                />
                            </label>
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="randomizeQuestions"
                                    checked={quizData.randomizeQuestions}
                                    onChange={(e) => handleChange(e, 'randomizeQuestions')}
                                />
                            }
                            label="Randomize Questions"
                        />
                        <div style={buttonStyle}>
                            <Button type='submit' variant="contained" color="primary"
                                disabled={disable}>
                                Save
                            </Button>
                            <Button onClick={onClose} variant="outlined" color="secondary">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default QuizEditModal;
