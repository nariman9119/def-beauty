import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { HeartSpinner } from 'react-spinners-kit';

import Swipeable from 'react-swipy';

import { submitEstimates } from '../../services';
import Card from './Card';
import Button from './Button';

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;

  align-items: center;
  font-family: sans-serif;
  overflow: hidden;
  background-color: salmon;
`;

const Wrapper = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const actionsStyles = {};

const Cards = ({ data } = {}) => {
  const [tempData, setTempData] = useState(data);
  const [estimates, setEstimates] = useState([]);
  const [submitReq, setSubmitReq] = useState({});
  const history = useHistory();

  useEffect(() => {
    setTempData(data.slice(0, 2));
    setTempData(data);
  }, [data]);

  const onSubmitEstimates = async () => {
    setSubmitReq({ loaded: false });
    const { error, data } = await submitEstimates({ estimates });
    setSubmitReq({ loaded: true, success: !error });
  };

  const remove = () => setTempData(tempData.slice(1, tempData.length));
  const onEstimate = isLike => setEstimates([...estimates, { url: tempData[0], isLike }]);

  console.log('estimates', estimates);

  if (submitReq.loaded && submitReq.success) {
    setTimeout(() => {
      history.push('/bot');
    }, 2000);
  }

  return (
    <Container>
      <Wrapper>
        {tempData.length > 0 && (
          <Wrapper>
            <Swipeable
              buttons={({ right, left }) => (
                <Actions style={actionsStyles}>
                  <Button
                    onClick={() => {
                      onEstimate(false);
                      left();
                    }}
                  >
                    Pass
                  </Button>
                  <Button
                    onClick={() => {
                      onEstimate(true);
                      right();
                    }}
                  >
                    Like
                  </Button>
                </Actions>
              )}
              onAfterSwipe={remove}
            >
              <Card url={tempData[0]} />
            </Swipeable>
            {tempData.length > 1 && <Card zIndex={-1} url={tempData[1]} />}
          </Wrapper>
        )}
        {tempData.length <= 1 && (
          <Card zIndex={tempData.length ? -2 : 1}>
            {submitReq.loaded === undefined && (
              <Button onClick={onSubmitEstimates}>Submit Estimations</Button>
            )}
            {submitReq.loaded && submitReq.success && (
              <span>The bot was launched to swipe automatically for you, buddy!</span>
            )}
            {submitReq.loaded && !submitReq.success && (
              <span>Error occurred while submitting your estimations</span>
            )}
            {submitReq.loaded === false && <HeartSpinner size={25} color="salmon" loading={true} />}
          </Card>
        )}
      </Wrapper>
    </Container>
  );
};

export default Cards;
