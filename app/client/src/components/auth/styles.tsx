import { rem } from 'polished';
import styled from 'styled-components';
import media from 'styled-media-query';

export const Subtitle = styled.div`
  font-size: ${rem('15px')};
  font-weight: 500;
  line-height: 1.33;
  color: #2c2c2c;
  margin: 5px 0;
`;

export const Content = styled.div`
  width: 100%;
  padding: 20px 50px 50px;

  ${media.lessThan('small')`
    padding: 0px 25px 0px 25px;
  `};
`;

export const DetailsInfo = styled.div`
  margin-top: 20px;
  ${media.lessThan('small')`
    margin-top: 0px;
    margin-bottom: 20px;
  `};
`;
