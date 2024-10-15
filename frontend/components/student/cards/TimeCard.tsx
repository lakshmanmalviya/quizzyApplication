import { giveTime } from '@/services/CommonServices';
import styles from '@/styles/student/AttempQuiz.module.css';
import React, { useEffect } from 'react';

interface TimeCardProps {
    time: number
    takeTimeLeftFromCard: (time: number) => void;
}

const TimeCard: React.FC<TimeCardProps> = ({ time, takeTimeLeftFromCard }) => {
    const [timeLeft, setTimeLeft] = React.useState<number>(time);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    takeTimeLeftFromCard(timeLeft);

    return (
        <div className={`${styles.headerItem} ${styles.headerTime}`}>
            {giveTime(timeLeft)}
        </div>
    )
}

export default TimeCard