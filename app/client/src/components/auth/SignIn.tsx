import { FormikActions } from 'formik';
import { rem } from 'polished';
import React, { FC, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import media from 'styled-media-query';
import { get } from 'lodash-es';

import { useAuthDataContext } from '../../common/AuthDataProvider';
import theme from '../../styles/theme';
import SignInForm from './SignInForm';
import { auth } from '../services';
import { Content } from './styles';

type MyFormValues = { email: string; password: string };

type AllProps = RouteComponentProps;

const SignIn: FC<AllProps> = ({ history }) => {
  console.log('history', history);
  const [error, setError] = useState('');
  const { onLogin } = useAuthDataContext();

  const handleAuth = async ({ email, password }) => {
    const res = await auth({ email, password });
    const { error, data } = res;
    if (error) return setError(get(error, 'message'));
    onLogin(data);
    history.push(get(history, 'location.state.from') || '/recommendations');

    // auth(token).then(data => {
    //   if (data.success == '1') {
    //     localStorage.setItem('userId', data.result.userAuthentication[0].userId);
    //     localStorage.setItem('roleName', data.result.userAuthentication[0].roleName);
    //     localStorage.setItem('userImage', data.result.userAuthentication[0].userImage);
    //     localStorage.setItem('firstName', data.result.userAuthentication[0].firstName);
    //     localStorage.setItem('lastName', data.result.userAuthentication[0].lastName);
    //
    //     if (data.result.userAuthentication[0].roleName !== 'ADMIN') {
    //       history.push('/admin/places');
    //     } else {
    //       setError('You have no permissions to access CMS');
    //     }
    //   } else if (data.success == '0') {
    //     setError(data.errorMessage);
    //   } else {
    //     setError('Login Failed');
    //   }
    // });
  };

  const handleSubmit = async (values, actions: FormikActions<MyFormValues>) => {
    setError('');
    await handleAuth(values);
    actions.setSubmitting(false);
  };

  const authorized = localStorage.getItem('roleName') === 'ADMIN';
  if (authorized) return <Redirect to={'/recommendations'} />;

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Tinder ++</Title>
        </Header>
        <Content>
          <ServerError>{error}</ServerError>
          <SignInForm onSubmit={handleSubmit} />
        </Content>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 480px;
  margin: 0 auto;
  position: relative;
  top: 50vh;
  transform: translateY(-50%);

  border: 1px solid #ccc;
  border-radius: 4px;

  background-color: #fff;
`;

const Header = styled.div`
  width: 100%;
  padding: 39px 50px 0;

  ${media.lessThan('small')`
    padding: 20px 25px;
  `};
`;

const Title = styled.div`
  font-size: ${rem('26px')};
  font-weight: bold;
  color: ${theme.colors.red};
`;

const ServerError = styled.div`
  color: ${theme.colors.red};
  font-size: 11px;
`;

export default SignIn;
