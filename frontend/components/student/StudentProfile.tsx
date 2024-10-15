import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserResultDataRequest } from '@/redux/slices/resultSlice';
import { fetchUserRequest } from '@/redux/slices/usersSlice';
import { RootState } from '@/redux/store';
import { getInitials, giveTime, isBase64 } from '@/services/CommonServices';
import { User } from '@/types/types';
import { Edit } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Grid, Paper,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditProfileModal from '../educator/modals/EditProfileModal';
import styles from '@/styles/educator/EducatorTable.module.css';

const StudentProfile: React.FC = () => {
    const { user } = useAppSelector((state: RootState) => state.user);
    const { userResultData } = useAppSelector((state: RootState) => state.result);
    const dispatch = useAppDispatch();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchUserRequest());
            dispatch(fetchUserResultDataRequest());
        }
    }, [dispatch]);

    return (
        <Box>
            <Paper elevation={3} sx={{ padding: 4, margin: 'auto', borderRadius: '1px', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
                <Grid container spacing={4} alignItems="center" justifyContent='center'>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Avatar
                            src={user.profilePic && isBase64(user.profilePic) ? user.profilePic : ''}
                            alt={user.name}
                            sx={{
                                width: 200,
                                height: 200,
                                margin: 'auto',
                                border: '4px solid white',
                                fontSize: '2rem',
                                backgroundColor: '#3f51b5',
                                color: '#fff'
                            }}
                        >
                            {!user.profilePic || !isBase64(user.profilePic) ? getInitials(user.name) : ''}
                        </Avatar>

                        <Tooltip title={user.name} placement="top"
                            enterDelay={300}
                            componentsProps={{
                                tooltip: {
                                    className: styles.toolTip,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'black',
                                    marginTop: 2,
                                    fontSize: '30px',
                                    fontWeight: 'bold'
                                }}>
                                Welcome,
                                {user.name.split(' ')[0].length <= 8 ? user.name.split(' ')[0] : user.name.split(' ')[0].substring(0, 8) + "..."}
                            </Typography>
                        </Tooltip>
                        <Tooltip title={user.email} placement="top"
                            enterDelay={300}
                            componentsProps={{
                                tooltip: {
                                    className: styles.toolTip,
                                },
                            }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'black',
                                    opacity: 0.8,
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Email :{user.email.length <= 20 ? user.email : user.email.substring(0, 17) + "..."}
                            </Typography>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, height: '115px' }} className={styles.card}>
                                    <Typography variant="h4">Bio</Typography>
                                    <Tooltip title={user.bio} placement="top"
                                        enterDelay={300}
                                        componentsProps={{
                                            tooltip: {
                                                className: styles.toolTip,
                                            },
                                        }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.bio || 'No bio available.'}
                                        </Typography>
                                    </Tooltip>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, height: '115px' }} className={styles.card}>
                                    <Typography variant="h4">Education</Typography>
                                    <Tooltip title={user.education} placement="top"
                                        enterDelay={300}
                                        componentsProps={{
                                            tooltip: {
                                                className: styles.toolTip,
                                            },
                                        }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.education}
                                        </Typography>
                                    </Tooltip>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, textAlign: 'center', height: '115px' }} className={styles.card}>
                                    <Typography variant="h4">TimeSpent</Typography>
                                    <Typography variant="h4" color="#0161F7" fontWeight={700}>
                                        {giveTime(userResultData.totalTimeSpent)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, textAlign: 'center', height: '115px' }} className={styles.card}>
                                    <Typography variant="h4">Score</Typography>
                                    <Typography variant="h4" color="#0161F7" fontWeight={700}>
                                        {userResultData.totalScore ?? 0} {'/'} {userResultData.totalOfTotalScore ?? 0}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, textAlign: 'center', height: '115px' }} className={styles.card}>
                                    <Typography variant="h6">Completed Quizzes</Typography>
                                    <Typography variant="h4" color="#0161F7" fontWeight={700}>
                                        {userResultData.totalCompletedQuizzes}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{ padding: 2, textAlign: 'center', height: '115px' }} className={styles.card}>
                                    <Typography variant="h6">Attempted Quizzes</Typography>
                                    <Typography variant="h4" color="#0161F7" fontWeight={700}>
                                        {userResultData.totalInCompletedQuizzes}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{ marginTop: 3, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        size="large"
                        variant="contained"
                        startIcon={<Edit />}
                        sx={{
                            background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                            transition: 'background 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)',
                                boxShadow: '0px 5px 7px rgba(0, 0, 0, 0.3)',
                            },
                            marginRight: 2,
                        }}
                        onClick={() => {
                            setEditingUser(user);
                        }}
                    >
                        Edit Profile
                    </Button>
                </Box>

            </Paper>
            {editingUser && (
                <EditProfileModal
                    user={editingUser}
                    handleClose={() => setEditingUser(null)}
                />
            )}
        </Box>
    );
};

export default StudentProfile;
