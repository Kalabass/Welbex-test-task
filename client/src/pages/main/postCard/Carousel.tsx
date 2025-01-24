import { Media } from '@/types/Media';
import { Card, CardMedia } from '@mui/material';
import { FC } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
const Carousel: FC<{ media: Media[] }> = ({ media }) => {
  const settings = {
    dots: media.length > 1,
    infinite: media.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const baseUrl = import.meta.env.VITE_INSTANCE_BASE_URL;
  return (
    <Slider {...settings}>
      {media.map((item, index) => (
        <Card key={index}>
          {item.type === 'image' ? (
            <CardMedia
              component='img'
              image={baseUrl + item.url}
              sx={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          ) : (
            <CardMedia
              component='video'
              controls
              src={baseUrl + item.url}
              sx={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          )}
        </Card>
      ))}
    </Slider>
  );
};

export { Carousel };
