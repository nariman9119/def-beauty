import React, { FunctionComponent, InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import theme from '../../styles/theme';
import { Error } from './Error';

type InputProps = {
  hasError?: boolean;
  placeholder?: string | JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

type BarProps = {
  hasError?: boolean;
  isFocusIn?: boolean;
};

type LabelProps = {
  active?: boolean;
  disabled?: boolean;
};

type FormInputProps = {
  label?: string | JSX.Element;
  errorLabel?: string | JSX.Element;
  serverError?: any;
  icon?: JSX.Element;
} & InputProps;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 20px auto 1px 15px;
  grid-template-areas:
    'label'
    'input'
    'bar'
    'error';
`;

export const Input = styled.input`
  grid-area: input;
  height: 30px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  outline: 0;
  background-color: ${props => (props.readOnly ? theme.colors.grey : theme.colors.white)};
  padding: 2px 0;
  color: ${(props: InputProps) => (props.hasError ? theme.colors.darkRed : theme.colors.darkGrey)};

  &::placeholder {
    color: ${theme.colors.grey};
  }

  &:disabled,
  &[disabled] {
    color: ${theme.colors.lightGrey};
  }
`;

export const Label = styled.label`
  color: ${(props: LabelProps) => getLabelColor(props)};
  font-size: ${(props: LabelProps) => (props.active ? '11px' : '15px')};
  top: ${(props: LabelProps) => (props.active ? '5px' : '25px')};
  pointer-events: none;
  position: relative;
  transition: all 0.2s ease-in-out;
`;

const StyledLabel = styled(Label)`
  grid-area: label;
`;

const StyledError = styled(Error)`
  grid-area: error;
`;

const StyledInput = styled(Input)`
  grid-area: input;
  font-size: 15px;
`;

const Bar = styled.div`
  grid-area: bar;
  border-bottom: 1px solid
    ${(props: BarProps) => (props.hasError ? theme.colors.darkRed : theme.colors.grey)};

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    left: 0;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s ease-in-out;
    transform: ${(props: BarProps) => {
      return props.isFocusIn ? 'scale(1);' : 'scale(0);';
    }};
    background: ${(props: BarProps) => {
      return props.hasError ? theme.colors.darkRed : theme.colors.darkGrey;
    }};
  }
`;

const StyledSvgIcon = styled.div`
  position: absolute;
  right: 0;
  top: 30px;
  cursor: pointer;

  &:hover {
    path {
      fill: ${theme.colors.darkGrey};
    }
  }
`;

const getLabelColor = props => {
  if (props.disabled) {
    return theme.colors.lightGrey;
  }

  if (props.active) {
    return theme.colors.darkGrey;
  }

  return theme.colors.grey;
};

export const FormInput: FunctionComponent<FormInputProps> = ({ children, ...inputProps }) => {
  const inputRef = useRef<HTMLInputElement>();
  const [isFocusIn, setFocus] = useState(false);
  const [hasError, setError] = useState(inputProps.hasError);

  useEffect(() => {
    inputRef.current.addEventListener('focus', () => {
      setFocus(true);
    });
    inputRef.current.addEventListener('blur', () => {
      setFocus(false);
    });
  }, []);

  useEffect(() => {
    setError(inputProps.hasError);
  }, [inputProps.hasError]);

  return (
    <Wrapper>
      {inputProps.label && (
        <StyledLabel active={isFocusIn || !!inputProps.value} disabled={inputProps.disabled}>
          {inputProps.label}
        </StyledLabel>
      )}
      <StyledInput ref={inputRef} {...inputProps} autoComplete="off" />
      <Bar hasError={hasError} isFocusIn={isFocusIn} />
      <StyledError {...inputProps} />
      {/* {(inputProps.errorLabel || inputProps.serverError) && (
        <StyledError
          name={inputProps.name}
          label={inputProps.errorLabel || inputProps.label}
          serverError={inputProps.serverError}
        />
      )} */}
      {inputProps.icon && <StyledSvgIcon>{inputProps.icon}</StyledSvgIcon>}
    </Wrapper>
  );
};
