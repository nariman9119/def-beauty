import { Field, FieldProps, Form, Formik, FormikActions, FormikProps } from 'formik';
import React, { FC } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';

import { FormInput } from '../common/FormInput';
import { Button } from '../ui-kit/Button';

type MyFormValues = { email: string; password: string };

type AllProps = {
  onSubmit: (values, actions: FormikActions<MyFormValues>) => void;
};

const SigninSchema = Yup.object().shape({
  email: Yup.string().email('email').required('required'),
  password: Yup.string().required('required'),
});

const SigninForm: FC<AllProps> = ({ onSubmit }) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SigninSchema}
        onSubmit={onSubmit}
        render={(formikBag: FormikProps<MyFormValues>) => (
          <Form>
            <Field
              name="email"
              render={({ field, form }: FieldProps<MyFormValues>) => (
                <div>
                  <FormInput
                    {...field}
                    name="email"
                    label={'Email'}
                    hasError={form.touched.email && !!form.errors.email}
                  />
                </div>
              )}
            />
            <Field
              name="password"
              render={({ field, form }: FieldProps<MyFormValues>) => (
                <div>
                  <FormInput
                    {...field}
                    name="password"
                    type="password"
                    label={'Password'}
                    hasError={form.touched.password && !!form.errors.password}
                  />
                </div>
              )}
            />
            <FormActions>
              <LoginButton type="submit" size="large">
                Log In
              </LoginButton>
            </FormActions>
          </Form>
        )}
      />
    </Wrapper>
  );
};

const FormActions = styled.div`
  margin-top: 10px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 10px;
`;

const ForrgotPassword = styled.div`
  margin-top: 10px;
  font-size: 10.9px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  color: #6a75c9;
  cursor: pointer;
`;

const LoginButton = styled(Button)`
  height: 44px;
`;

export default SigninForm;
