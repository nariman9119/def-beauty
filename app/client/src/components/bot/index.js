import React, { useEffect, useState } from 'react';
import AwesomeSlider from 'react-awesome-slider';
// import AwesomeSliderStyles from 'react-awesome-slider/src/styles';
import styled from 'styled-components';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fold-out-animation';

import { Button } from '../ui-kit/Button';
import { launchBot, stopBot } from '../services';
import { initWs, onEvent } from '../../utils/ws';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Title = styled.div`
  display: flex;
  width: 100%;

  padding: 1vw 5vw;

  justify-content: space-between;
`;

const ActionContainer = styled.div`
  width: 10vw;
`;

const ActionButton = styled(Button)`
  height: 44px;
  font-size: 12px;
`;

const Bot = () => {
  const [likedPhotos, setLikedPhotos] = useState([]);

  const handleLaunchBot = async () => {
    const res = await launchBot();
    const { error, data } = res;
    console.log('LAUNCH BOT DATA', data);
  };

  const handleStopBot = async () => {
    const res = await stopBot();
    const { error, data } = res;
    console.log('STOP BOT DATA', data);
  };

  useEffect(() => {
    // setLikedPhotos([
    //   'https://images-ssl.gotinder.com/5dce98c7afc2220100d382e8/original_7e7ffeab-8f11-446f-827a-deeae413870e.jpeg',
    // ]);

    initWs();
    handleLaunchBot();
    setTimeout(() => {
      onEvent('like', data => {
        console.log('NEW LIKE 22');
        setLikedPhotos([data.photo, ...likedPhotos]);
      });
    }, 2000);

    return () => {
      handleStopBot();
    };
  }, []);

  return (
    <Container>
      <Title>
        <h5>Users the bot liked for you</h5>
        <ActionContainer>
          <ActionButton onClick={handleStopBot}>Stop Bot</ActionButton>
        </ActionContainer>
      </Title>
      <AwesomeSlider cssModule={AwesomeSliderStyles}>
        {likedPhotos.map(url => {
          return <div key={url} data-src={url} />;
        })}
      </AwesomeSlider>
    </Container>
  );
};

export default Bot;
