import styled, { css } from 'styled-components';

export default css`
  html,
  body,
  #__next {
    height: 100%;
  }
  body {
    &.ReactModal__Body--open {
      overflow-y: hidden;
    }
    button.shareSectionDiv {
      width: auto;
    }
  }
`;
