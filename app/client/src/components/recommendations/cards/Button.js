import React from 'react';
import styled from 'styled-components';

const Button = ({ children, onClick }) => <StyledButton onClick={onClick}>{children}</StyledButton>;

const StyledButton = styled.button`
  padding: 16px 24px;
  background-color: whitesmoke;
  cursor: pointer;
  border: none;
  border-radius: 3;
`;

export default Button;
