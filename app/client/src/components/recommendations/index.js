import React, { useEffect, useState } from 'react';
import { HeartSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

import Cards from './cards';
import { getRecommendations } from '../services';

const SpinnerContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Recommendations = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const { error, data } = await getRecommendations();
      console.log('data', data);
      console.log('error', error);
      if (!error) setPhotos(data.photos);
    };
    loadRecommendations();
  }, []);

  console.log('photos', photos);

  if (!photos.length) {
    return (
      <SpinnerContainer>
        <HeartSpinner size={100} color="salmon" loading={true} />
      </SpinnerContainer>
    );
  }
  return <Cards data={photos} />;
};

export default Recommendations;
