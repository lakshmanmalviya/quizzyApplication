import React from 'react';
import styles from '@/styles/Footer.module.css';

export const Footer = () => {
    return (
        <>
            <div className={styles.footerMainContainer}>
                <div className={styles.footAboveContainer}>
                    <div className={styles.aboveFooterText}>
                        Top educators and institutions choose Quizzy to create quizzes
                    </div>
                </div>

                <div className={styles.footerBelowContainer}>
                    <div className={styles.footerSubContainer}>
                        <div className={styles.footerSubContainerItem}>QuizMasters</div>
                        <div className={styles.footerSubContainerItem}>Create Your Quiz</div>
                        <div className={styles.footerSubContainerItem}>About us</div>
                        <div className={styles.footerSubContainerItem}>Contact us</div>
                    </div>

                    <div className={styles.footerSubContainer}>
                        <div className={styles.footerSubContainerItem}>Careers</div>
                        <div className={styles.footerSubContainerItem}>Blog</div>
                        <div className={styles.footerSubContainerItem}>Help and Support</div>
                    </div>
                    <div className={styles.footerSubContainer}>
                        <div className={styles.footerSubContainerItem}>Terms of Service</div>
                        <div className={styles.footerSubContainerItem}>Privacy Policy</div>
                        <div className={styles.footerSubContainerItem}>Accessibility</div>
                    </div>
                </div>
            </div>
        </>
    );
};
