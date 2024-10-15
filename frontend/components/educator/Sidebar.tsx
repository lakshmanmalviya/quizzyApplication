import { useAppDispatch } from '@/redux/hooks';
import { resetAuthStateOnLogout } from '@/redux/slices/authSlice';
import { resetAllProps } from '@/redux/slices/propSlice';
import { resetUserStateOnLogout } from '@/redux/slices/usersSlice';
import { logout } from '@/services/CommonServices';
import styles from '@/styles/educator/Sidebar.module.css';
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ConfirmModal from '../student/modals/ConfirmModal';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const navigateTo = (path: string) => {
    dispatch(resetAllProps())
    router.push(path);
  };

  const handleLogout = () => {
    dispatch(resetAuthStateOnLogout());
    dispatch(resetUserStateOnLogout());
    logout();
    router.push('/');
  };

  const confirm = () => {
    handleLogout();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Educator Dashboard</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <p
            className={`${styles.link} ${router.pathname === '/educator/dashboard' ? styles.active : ''}`}
            onClick={() => navigateTo('/educator/dashboard')}
          >
            Profile
          </p>
        </li>
        <li className={styles.listItem}>
          <span
            className={`${styles.link} ${router.pathname === '/educator/quizzes' ? styles.active : ''}`}
            onClick={() => navigateTo('/educator/quizzes')}
          >
            Quizzes
          </span>
        </li>
        <li className={styles.listItem}>
          <span
            className={`${styles.link} ${router.pathname === '/educator/questions' ? styles.active : ''}`}
            onClick={() => navigateTo('/educator/questions')}
          >
            Questions
          </span>
        </li>
        <li className={styles.listItem}>
          <span
            className={styles.link}
            onClick={handleOpen}
            title='Logout'
          >
            Logout
            <Logout
              sx={{ fontSize: '16px', color: '#ff4b2b', marginLeft: '2px' }}
            />
          </span>
        </li>
      </ul>
      {
        open &&
        <ConfirmModal
          onClose={handleClose}
          confirm={confirm}
          text='Are you sure you want to logout ?'
          buttonName='Logout'
        />
      }
    </div>
  );
};

export default Sidebar;
