import { checkIsBase64Boolean } from '@/services/CommonServices';
import styles from '@/styles/student/QuestionOptions.module.css';
import { Option, Question } from '@/types/types';
import React from 'react';

interface QuestionOptionsProps {
    question: Question;
    index: number;
    onAnswerSelect: (questionId: number, optionId: number) => void;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({ question, onAnswerSelect, index }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        onAnswerSelect(question.id, Number(e.target.value));
    };

    return (
        <div className={styles.questionContainer}>
            <div>
                {question.text && <div className={styles.questionText}>{`Q.${index} ${question.text}`}</div>}
                {checkIsBase64Boolean(question.questionPic) && (
                    <div className={styles.questionImageContainer}>
                        <img
                            src={question.questionPic}
                            alt={`Question ${index}`}
                            className={styles.questionImage}
                        />
                    </div>
                )}
            </div>
            
            <div className={styles.optionContainer}>
                {question.options.map((option: Option) => (
                    <div
                        className={`${styles.optionCardContainer} ${option.isSelected ? styles.selectedOption : ''}`}
                        key={option.id}
                        onClick={() => onAnswerSelect(question.id, option.id)}
                    >
                        <input
                            type="radio"
                            id={`option${option.id}`}
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={option.isSelected}
                            onChange={handleChange}
                            className={styles.optionRadio}
                        />

                        {option.text.trim().length === 0 ? (
                            <label htmlFor={`option${option.id}`} className={styles.optionImageContainer}>
                                <img
                                    src={option.optionPic}
                                    alt={`Option ${option.id}`}
                                    className={styles.optionImage}
                                />
                            </label>
                        ) : (
                            <label htmlFor={`option${option.id}`} className={styles.optionText}>
                                {option.text}
                            </label>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionOptions;
