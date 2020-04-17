import { ErrorMessage } from 'formik';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import theme from '../../styles/theme';

const Message = styled.span`
  color: ${theme.colors.darkRed};
  font-size: 12px;
  line-height: 1.4;
`;

type Props = {
  name?: string;
  label?: string | JSX.Element;
  value?: string | number | string[];
};

export const Error: FunctionComponent<Props> = ({ name, label, value }) => {
  return (
    <ErrorMessage
      name={name}
      render={msg => {
        return (
          <Message>
            <FormattedMessage {...messages[msg]} values={{ value, name, label }} />
          </Message>
        );
      }}
    />
  );
};

const messages = defineMessages({
  minLength: {
    id: 'errors.minLength',
    defaultMessage: 'It`s too short',
    description: 'minLength error',
  },
  email: {
    id: 'errors.email',
    defaultMessage: '{label} is invalid',
    description: 'email error',
  },
  required: {
    id: 'errors.required',
    defaultMessage: '{label} is required',
    description: 'required error',
  },
});
