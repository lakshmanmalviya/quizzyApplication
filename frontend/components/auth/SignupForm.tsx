import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createUserRequest, resetUserMessage } from '@/redux/slices/usersSlice';
import { RootState } from '@/redux/store';
import styles from '@/styles/auth/SignupForm.module.css';
import { Role, User } from '@/types/types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SignupForm: React.FC = () => {
  const { userMessage, userError } = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(true);

  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    password: '',
    role: Role.STUDENT,
    profilePic: '',
    bio: '',
    education: '',
    isActive: true,
    isApproved: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    education: '',
  });

  useEffect(() => {
    if (userMessage) {
      setFormData({
        id: 0, name: '', email: '', password: '', role: Role.STUDENT, profilePic: '', bio: '',
        education: '', isActive: true, isApproved: false,
      });
      toast.success('User registered successfully', { position: 'top-center' });
      dispatch(resetUserMessage());
      router.replace('/login');
    }

    if (userError) {
      if (userError != 'Unexpected end of JSON input')
        toast.error(userError, { position: 'top-center' });
      dispatch(resetUserMessage());
    }
  }, [userError, userMessage,]);

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      setFormData((prevData) => ({
        ...prevData,
        profilePic: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDisable(false);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent<Role>) => {
    setDisable(false);
    setFormData((prevData) => ({
      ...prevData,
      role: e.target.value as Role,
    }));
  };

  const validateForm = (): boolean => {
    let valid = true;
    let nameError = '', emailError = '', passwordError = '', educationError = '', bioError = '';

    setFormData({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      bio: formData.bio.trim(),
      education: formData.education.trim(),
    })

    if (!formData.name.trim()) {
      nameError = 'Name is required.';
      valid = false;
    } else if (formData.name.trim().length < 3 || formData.name.trim().length > 100) {
      nameError = 'Name should have between 3 and 100 characters.';
      valid = false;
    } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(formData.name.trim())) {
      nameError = 'Name should start with a letter and contain only letters, numbers, and spaces.';
      valid = false;
    }
    if (!formData.email.trim()) {
      emailError = 'Email is required.';
      valid = false;
    }
    else if (formData.email.trim().length > 100) {
      nameError = 'Email should have max 100 characters.';
      valid = false;
    } 
    
    else if (!/^[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email.trim())) {
      emailError = 'Please enter a valid email address.';
      valid = false;
    }
    if (!formData.password.trim()) {
      passwordError = 'Password is required.';
      valid = false;
    } else if (formData.password.trim().length < 8 || formData.password.trim().length > 100) {
      passwordError = 'Password should have between 8 and 100 characters.';
      valid = false;
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password.trim())) {
      passwordError = 'Password must include at least one number, one uppercase letter, and one lowercase letter';
      valid = false;
    }

    if (formData.bio.trim().length > 150) {
      bioError = 'Maximum character should have only 150';
      valid = false;
    }

    if (formData.education.trim().length > 150) {
      educationError = 'Maximum character should have only 150';
      valid = false;
    }

    setErrors({ name: nameError, email: emailError, password: passwordError, bio: bioError, education: educationError });
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createUserRequest(formData));
      setDisable(true);
    }
  };

  const navigateToLogin = () => {
    router.replace('/login');
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const goBack = () => {
    router.back();
  }

  return (
    <Paper elevation={3} sx={{ height: '100%', maxWidth: '600px' }}>
      <Box sx={{ ...modalStyle, padding: '15px 20px' }} >
        <Box component="div" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href='' >
            <img src="/quizzy.png" onClick={goBack} />
          </Link>
        </Box>
        <Typography variant="h4" gutterBottom className={styles.title}>
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-pic-upload"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-pic-upload">
              <Avatar
                src={formData.profilePic || ""}
                alt="Profile Picture"
                className={styles.avatar}
              />
            </label>
          </Box>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: '30px'
          }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              label="Email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                error={Boolean(errors.password)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <Typography color="error" fontSize={12}>{errors.password}</Typography>}
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                label="Role"
              >
                <MenuItem value={Role.STUDENT}>Student</MenuItem>
                <MenuItem value={Role.EDUCATOR}>Educator</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              maxRows={2}
              error={Boolean(errors.bio)}
              helperText={errors.bio}
            />

            <TextField
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              maxRows={2}
              error={Boolean(errors.education)}
              helperText={errors.education}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', columnGap: '20px', marginTop: '20px' }}>
            <Button
              sx={{ width: '100px' }}
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              disabled={disable}
            >
              Sign Up
            </Button>
            <Typography sx={{ textAlign: 'center', marginTop: '10px' }}>
              Already have an account?{' '}
              <span
                onClick={navigateToLogin}
              >
                <Link
                  href=''
                >
                  Log In
                </Link>
              </span>
            </Typography>
          </div>
        </form>
      </Box>
    </Paper>
  );
};

export default SignupForm;

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '8px',
  p: 2,
  overflowY: 'auto',
}
