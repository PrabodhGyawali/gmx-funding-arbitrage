import React, { useState } from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CarouselItem {
  image: string;
  caption: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, margin: 'auto' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Box
          component="img"
          src={items[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: 400,
            objectFit: 'contain',
          }}
        />
      </Paper>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          padding: 1,
          backgroundColor: '#f5f5f5',
          color: 'black',
          textAlign: 'center',
        }}
      >
        {items[currentIndex].caption}
      </Typography>
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          width: 40,
          height: 40,
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          width: 40,
          height: 40,
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default Carousel;