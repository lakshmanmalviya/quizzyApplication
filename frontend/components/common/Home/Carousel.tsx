import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { capitalizeWords, isBase64 } from '@/services/CommonServices';
import styles from '@/styles/student/ListEducatorCatQuiz.module.css';
import { User } from '@/types/types';
import { Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from '@mui/material';

interface MeetEducatorsProps {
  educators: User[];
}

const MeetEducators: React.FC<MeetEducatorsProps> = ({ educators }) => {

  const settings = {
    infinite: true,
    slidesToShow: 4,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {
          educators.map((educator) => {
            if (educator.isApproved ?? false)
              return (
                <Card
                  key={educator.id}
                  sx={cardDesign}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={isBase64(educator.profilePic)}
                      alt={isBase64(educator.profilePic)}
                      className={styles.cardMedia}
                    />
                    <CardContent>
                      <Tooltip title={educator.name} placement="top-start"
                        enterDelay={300}
                        componentsProps={{
                          tooltip: {
                            className: styles.toolTip,
                          },
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          className={styles.cardTitle}
                        >
                          {capitalizeWords(educator.name)}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={educator.bio} placement="top"
                        enterDelay={300}
                        componentsProps={{
                          tooltip: {
                            className: styles.toolTip,
                          },
                        }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          className={`${styles.cardBio}`}>
                          <strong>Bio:</strong>{educator.bio || 'No bio available'}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={educator.education} placement="top"
                        enterDelay={300}
                        componentsProps={{
                          tooltip: {
                            className: styles.toolTip,
                          },
                        }}>
                        <Typography variant="body2" color="text.primary" className={styles.cardBio}>
                          <strong>Education:</strong> {educator.education || 'Not provided'}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary" className={styles.cardInfo}>
                        <strong>Quizzes Created:</strong> {educator.quizzes?.length}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )
          })}
      </Slider>
    </div>
  );
};

export default MeetEducators;


const cardDesign = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '200px',
  height: '350px',
  margin: '190px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'transform 0.2s',
};
