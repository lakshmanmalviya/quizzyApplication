import { checkAtleastOneFieldIsFilledWithData, checkIsBase64Icon } from '@/services/CommonServices';
import { buttonStyle } from '@/styles/CommonStyle.module';
import { Option, Question } from '@/types/types';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

interface UpdateTwoOptionCardProps {
  handleUpdateQuestion: (question: Question) => void;
  onClose: () => void;
  question: Question;
  index: number;
}

const UpdateTwoOptionCard: React.FC<UpdateTwoOptionCardProps> = ({ index, question, handleUpdateQuestion, onClose }) => {
  const [correctOption, setCorrectOption] = useState<string>('option1');
  const [options, setOptions] = useState<Option[]>([...question.options]);
  const [editQuestion, setEditQuestion] = useState<Question>({ ...question });
  const [disable, setDisable] = useState<boolean>(true);

  const handleOptionChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDisable(false);
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: e.target.value };
    setOptions(newOptions);
  };

  const [errors, setErrors] = useState({
    text: '',
    maxScore: '',
  });

  const validateForm = (): boolean => {
    let valid = true; let textError = '', maxScoreError = '';

    setEditQuestion({
      ...editQuestion,
      text: editQuestion.text.trim(),
    })

    if (!editQuestion.text.trim()) {
      textError = "Question is required.";
      valid = false;
    } else if (editQuestion.text.trim().length < 3 || editQuestion.text.trim().length > 255) {
      textError = "Question should have at least 3 and max 255 characters.";
      valid = false;
    }

    if (editQuestion.maxScore <= 0 || editQuestion.maxScore > 10) {
      maxScoreError = "Max score should be between at least one and max 10";
      valid = false;
    }

    setErrors({
      text: textError,
      maxScore: maxScoreError,
    });
    return valid;
  };

  const handleQuestionChange = (e: SelectChangeEvent<number> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Question) => {
    setDisable(false);
    const value = field === 'randomizeOptions' ? (e.target as HTMLInputElement).checked : e.target.value;
    setEditQuestion((prevQuestion) => ({ ...prevQuestion, [field]: value, }));
  };

  const handleCorrectOptionChange = (e: SelectChangeEvent<string>) => {
    setDisable(false);
    setCorrectOption(e.target.value)
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (checkAtleastOneFieldIsFilledWithData(options)) {
        setDisable(true);
        const updatedOptions = options.map((option: Option, index: number) => ({
          ...option,
          isCorrect: `option${index + 1}` === correctOption
        }));
        handleUpdateQuestion({ ...editQuestion, options: updatedOptions });
      }
      else {
        toast.error('Please fill the data option text or pic at least one should be there !', { position: 'top-center' });
      }
    };
  }

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
        setEditQuestion((prevData) => ({
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
        Edit Question {index}
      </Typography>
      <form onSubmit={handleAdd} autoComplete="off">
        <TextField
          name="text"
          label="Question"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editQuestion.text}
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
              src={checkIsBase64Icon(editQuestion.questionPic)}
              style={{ maxWidth: '500 px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
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
          value={editQuestion.maxScore}
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
            required
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
              onChange={(e) => handleQuestionChange(e, "randomizeOptions")}
              color="primary"
              value={editQuestion.randomizeOptions}
            />
          }
          label="Randomize Options"
          sx={{ mt: 2 }}
        />
        <Box mt={2}>
          <div style={buttonStyle}>
            <Button variant="contained" color="primary" sx={{ fontSize: '14px' }}
              type='submit'
              disabled={disable}>
              Update
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
export default UpdateTwoOptionCard;