import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetQuestionState } from '@/redux/slices/questionSlice';
import { fetchQuizzesRequest } from '@/redux/slices/quizSlice';
import { RootState } from '@/redux/store';
import { checkAtleastOneFieldIsFilledWithData, twoOptionBlankArray } from '@/services/CommonServices';
import { buttonStyle } from '@/styles/CommonStyle.module';
import { Option, Question, QuestionType, Quiz } from '@/types/types';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CreateTwoOptionCardProps {
  handleAddQuestion: (question: Question) => void;
  onClose: () => void;
}

const CreateTwoOptionCard: React.FC<CreateTwoOptionCardProps> = ({ handleAddQuestion, onClose }) => {
  const [correctOption, setCorrectOption] = useState<string>('option1');
  const { quizId } = useAppSelector((state: RootState) => state.props);
  const { question } = useAppSelector((state: RootState) => state.question);
  const [options, setOptions] = useState<Option[]>(twoOptionBlankArray);
  const dispatch = useAppDispatch();
  const { quizzes } = useAppSelector((state: RootState) => state.quiz);
  const [disable, setDisable] = useState<boolean>(true);
  const [questionData, setQuestionData] = useState<Question>({
    ...question,
    quizId: quizId,
    options: [],
  });

  useEffect(() => {
    dispatch(fetchQuizzesRequest(''));
  }, [dispatch]);


  const [errors, setErrors] = useState({
    text: '',
    quizId: '',
    maxScore: '',
  });

  const validateForm = (): boolean => {
    let valid = true;
    let textError = '', quizIdError = '', maxScoreError = '';

    setQuestionData({
      ...questionData,
      text: questionData.text.trim(),
    })

    if (!questionData.text.trim()) {
      textError = "Question is required.";
      valid = false;
    } else if (questionData.text.trim().length < 3 || questionData.text.trim().length > 255) {
      textError = "Question should have at least 3 and max 255 characters.";
      valid = false;
    }

    if (questionData.quizId == -1) {
      quizIdError = "Quiz is required.";
      valid = false;
    }
    if (questionData.maxScore <= 0 || questionData.maxScore > 10) {
      maxScoreError = "Max score should be between at least one and max 10";
      valid = false;
    }

    setErrors({
      text: textError,
      quizId: quizIdError,
      maxScore: maxScoreError,
    });

    return valid;
  };

  const handleOptionChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDisable(false);
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: e.target.value };
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (e: SelectChangeEvent<string>) => {
    setDisable(false);
    setCorrectOption(e.target.value)
  };

  const handleQuestionChange = (e: SelectChangeEvent<number> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Question) => {
    setDisable(false);
    const value = field === 'randomizeOptions' ? (e.target as HTMLInputElement).checked : e.target.value;
    setQuestionData((prevQuestion) => ({ ...prevQuestion, [field]: value, }));
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setDisable(true);
      if (checkAtleastOneFieldIsFilledWithData(options)) {
        const updatedOptions = options.map((option: Option, index: number) => ({
          ...option,
          isCorrect: `option${index + 1}` === correctOption
        }));
        handleAddQuestion({ ...questionData, options: updatedOptions });
        setQuestionData({
          id: -1, text: '', questionType: QuestionType.TWOOPTION, quizId: quizId,
          options: twoOptionBlankArray,
          maxScore: 0,
        })
        setOptions(twoOptionBlankArray);
        dispatch(resetQuestionState());
      }
      else {
        toast.error('Please fill the data, option text or pic at least one should be there !', { position: 'top-center' });
      }
    }
  };

  const handleQuestionAndOptionPictureChange = (event: ChangeEvent<HTMLInputElement>, name: string, index: number) => {
    setDisable(false);
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      convertImageToBase64String(file, name, index);
    }
  };

  const convertImageToBase64String = (file: File, name: string, index: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = (reader.result as string).replace('jpeg', 'png');
      if (name == 'question') {
        setQuestionData((prevData) => ({
          ...prevData,
          questionPic: result,
        }));
      }
      if (name === 'option' && index >= 0) {
        setOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions[index] = { ...newOptions[index], optionPic: result };
          return newOptions;
        });
      }
    }
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        margin: 'auto',
        backgroundColor: 'white',
        marginTop: '5px'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create A Question
      </Typography>
      <form onSubmit={handleAdd} autoComplete="off">
        <FormControl fullWidth margin="normal" variant="outlined" size="medium">
          <InputLabel>Select Quiz</InputLabel>
          <Select
            name="quizId"
            label="Quiz"
            error={Boolean(errors.quizId)}
            onChange={(e) => handleQuestionChange(e, 'quizId')}
            value={questionData.quizId}
            aria-required
          >
            {quizzes.content.map((quiz: Quiz) => (
              <MenuItem key={quiz.id} value={quiz.id}>
                {quiz.title}
              </MenuItem>
            ))}
          </Select>
          {errors.quizId && <Typography color="error" fontSize={12}>{errors.quizId}</Typography>}
        </FormControl>

        <TextField
          name="text"
          label="Question"
          variant="outlined"
          fullWidth
          margin="normal"
          value={questionData.text}
          onChange={(e) => handleQuestionChange(e, 'text')}
          error={Boolean(errors.text)}
          helperText={errors.text}
        />
        <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="question-pic-upload"
            onChange={(e) => handleQuestionAndOptionPictureChange(e, 'question', -1)}
          />
          <label htmlFor="question-pic-upload">
            <img
              src={questionData.questionPic}
              style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
            />
          </label>
        </Box>

        <TextField
          name="maxScore"
          label="Marks"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={questionData.maxScore}
          onChange={(e) => handleQuestionChange(e, 'maxScore')}
          error={Boolean(errors.maxScore)}
          helperText={errors.maxScore}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="option1"
              label="Option 1"
              variant="outlined"
              fullWidth
              margin="normal"
              value={options[0].text}
              onChange={handleOptionChange(0)}
            />
            <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="option1-pic-upload"
                onChange={(e) => handleQuestionAndOptionPictureChange(e, 'option', 0)}
              />
              <label htmlFor="option1-pic-upload">
                <img
                  src={options[0].optionPic}
                  style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                />
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="option2"
              label="Option 2"
              variant="outlined"
              fullWidth
              margin="normal"
              value={options[1].text}
              onChange={handleOptionChange(1)}
            />
            <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="option2-pic-upload"
                onChange={(e) => handleQuestionAndOptionPictureChange(e, 'option', 1)}
              />
              <label htmlFor="option2-pic-upload">
                <img
                  src={options[1].optionPic}
                  style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                />
              </label>
            </Box>
          </Grid>
        </Grid>

        <FormControl component="fieldset" sx={{ mt: 2 }} style={{ display: 'flex' }}>
          <FormLabel component="legend" id="option-selectable">Correct Option</FormLabel>
          <Select
            id="option-selectable"
            name="correctOption"
            value={correctOption}
            label="Correct Option"
            onChange={handleCorrectOptionChange}
          >
            <MenuItem value="option1">Option 1 </MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={questionData.randomizeOptions}
              onChange={(e) => handleQuestionChange(e, "randomizeOptions")}
              color="primary"
            />
          }
          label="Randomize Options"
          sx={{ mt: 2 }}
        />
        <Box mt={2}>
          <div style={buttonStyle}>
            <Button variant="contained" color="primary" sx={{ fontSize: '14px' }}
              type='submit'
              disabled={disable}
            >
              Create
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary" sx={{ fontSize: '14px' }}>
              Cancel
            </Button>
          </div>
        </Box>
      </form>
    </Box>
  );
};
export default CreateTwoOptionCard;