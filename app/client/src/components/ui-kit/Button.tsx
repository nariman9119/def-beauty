import { darken, rem } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components';

import theme from '../../styles/theme';

export type ButtonProps = {
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: JSX.Element;
};

const DefaultButton: FC<ButtonProps> = ({
  onClick,
  type,
  disabled,
  children,
  className,

  icon,
}) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {icon && <i className="icon">{icon}</i>}
      {children}
    </button>
  );
};

type ButtonStyleProps = {
  size?: 'small' | 'large';
  outline?: boolean;
  secondary?: boolean;
  filled?: boolean;
  circle?: boolean;
  round?: boolean;
  icon?: JSX.Element;
  onClick?: any;
};

export const Button = styled(DefaultButton)<ButtonStyleProps>`
  height: ${props => getHeight(props)};
  width: ${props => (props.circle ? getHeight(props) : '100%')};
  padding: ${props => (props.circle ? 0 : '0px 15px')};
  border-radius: ${props => getBorderRadius(props)};
  cursor: pointer;
  border: 1px solid;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${props => {
    if (props.outline) {
      return theme.colors.white;
    }

    if (props.secondary) {
      return theme.colors.lightGrey;
    }

    return theme.colors.red;
  }};

  border-color: ${props => {
    if (props.outline) {
      return theme.colors.grey;
    }

    return theme.colors.red;
  }};

  color: ${props => {
    if (props.outline) {
      return theme.colors.darkGrey;
    }
    return theme.colors.white;
  }};

  font-size: ${props => {
    if (props.size === 'large') {
      return rem('12px');
    }
    return rem('10px');
  }};
  font-family: HelveticaNeue;
  font-weight: 500;
  line-height: 0.91;

  transition: background-color 0.3s ease-out;

  &:focus,
  &:hover,
  &:active {
    box-shadow: none;
    outline: 0;
  }
  &:hover {
    background-color: ${props => {
      if (props.outline) {
        return theme.colors.lightGrey;
      }
      if (props.secondary) {
        return darken(0.05, theme.colors.lightGrey);
      }
      return theme.colors.darkRed;
    }};

    border-color: ${props => {
      if (props.outline) {
        return theme.colors.grey;
      }
      return theme.colors.darkRed;
    }};

    color: ${props => {
      if (props.outline) {
        return theme.colors.darkGrey;
      }

      if (props.secondary) {
        return theme.colors.red;
      }

      return theme.colors.white;
    }};
  }

  &:disabled,
  &[disabled] {
    box-shadow: none;
    background-color: ${props => {
      if (props.outline) {
        return theme.colors.white;
      }

      return theme.colors.grey;
    }};

    border-color: ${props => {
      if (props.outline) {
        return theme.colors.grey;
      }
      return theme.colors.red;
    }};

    color: ${props => {
      if (props.outline) {
        return theme.colors.darkGrey;
      }
      return theme.colors.white;
    }};

    .icon {
      svg {
        path {
          fill: ${props => {
            if (props.outline) {
              return theme.colors.grey;
            }
            return theme.colors.white;
          }};
        }
      }
    }
  }

  .icon {
    padding-right: 6px;
  }

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const getHeight = props => {
  if (props.size === 'large') {
    return '36px';
  }
  if (props.size === 'small') {
    return '20px';
  }

  return '30px';
};
const getBorderRadius = props => {
  if (props.circle) {
    return '50%';
  }
  if (props.round) {
    return '17px';
  }

  return '4px';
};

Button.defaultProps = { type: 'button' };
