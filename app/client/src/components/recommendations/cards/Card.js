import React from 'react';
import styled from 'styled-components';

const Card = ({ zIndex = 0, url, children }) => (
  <StyledCard url={url} zIndex={zIndex}>
    {children}
  </StyledCard>
);

export const StyledCard = styled.div`
  width: 500px;
  height: 500px;
  top: 0;
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 3;

  cursor: pointer;
  userselect: none;

  ${props => `
    z-index: ${props.zIndex};
    ${
      props.url
        ? `
      background-image: url(${props.url});
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      
    `
        : `
        
          background: whitesmoke;

        `
    }
  `}
`;

export default Card;
