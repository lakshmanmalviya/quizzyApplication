import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginRequest, resetAuth } from '@/redux/slices/authSlice';
import { fetchUserRequest, resetUserMessage } from '@/redux/slices/usersSlice';
import { RootState } from '@/redux/store';
import styles from '@/styles/auth/LoginForm.module.css';
import { LoginData } from '@/types/types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const LoginForm: React.FC = () => {
  const { authError, authMessage, auth } = useAppSelector((state: RootState) => state.auth);
  const { user, userMessage } = useAppSelector((state: RootState) => state.user);
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchUserRequest())
  }, [])

  useEffect(() => {
    if (userMessage) {
      if (user.role == 'Student') {
        router.replace('/student/dashboard');
        dispatch(resetUserMessage());
      }
      else if (user.role == 'Admin') {
        router.replace('/admin/dashboard');
        dispatch(resetUserMessage());
      }
      else if (user.role == 'Educator' && user.isApproved) {
        router.replace('/educator/dashboard');
        dispatch(resetUserMessage());
      }
    }
  }, [userMessage])

  useEffect(() => {
    if (authMessage) {
      localStorage.setItem('token', auth?.token);
      toast.success('Logged in successfully', { position: 'top-center' });
      if (auth?.role == 'Student') {
        router.replace('/student/dashboard');
      }
      else if (auth?.role == 'Admin') {
        router.replace('/admin/dashboard');
      }
      else if (auth?.role == 'Educator' && auth.isApproved) {
        router.replace('/educator/dashboard');
      }
      dispatch(resetAuth());
    }
    if (authError) {
      toast.error(authError, { position: 'top-center' });
      dispatch(resetAuth());
    }
  }, [authError, authMessage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDisable(false);
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginRequest(loginData));
      setDisable(true);
    }
  };

  const navigateToSignup = () => {
    router.replace('/signup')
  }

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

  const validateForm = (): boolean => {
    if (loginData.email.trim() && loginData.password.trim()) {
      if (!/^[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(loginData.email.trim()) || (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(loginData.password.trim()))) {
        toast.error('Invalid credentials please enter the valid email and password', { position: 'top-center', autoClose: 600 });
        return false;
      }
    }
    return true;
  };

  return (
    <div className={styles.loginFormContainer}>
      <Container>
        <Paper elevation={3} className={styles.paper}>
          <Box p={4}>
            <Typography variant="h3" gutterBottom className={styles.title}>
              <div className={styles.hoverOnImage}>
                <img src="/quizzy.png" onClick={goBack} />
              </div>
              Welcome Back
            </Typography>
            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                label="Email"
                name="email"
                type="text"
                value={loginData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
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
                  value={loginData.password}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={styles.submitButton}
                disabled={disable}
              >
                Log In
              </Button>
              <Typography sx={{ textAlign: 'center', marginTop: '10px' }}>
                Don&apos;t have an account?{' '}
                <span
                  onClick={navigateToSignup}
                >
                  <Link
                    href=''
                  >
                    Sign up
                  </Link>
                </span>
              </Typography>
            </form>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginForm