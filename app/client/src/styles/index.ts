import { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import globals from './globals';

export const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  ${globals}
`;
