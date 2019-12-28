import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 0.5rem;
  padding-left: 0;
  font-size: 13px;
  div {
    height: 26px;
    padding-left: 15px;
    line-height: 26px;
    i {
      display: none;
      position: absolute;
      top: 8px;
      right: 10px;
      color: #787e8f;
      cursor: pointer;
    }
    ${({ value }) => {
      if (value) {
        return css`
          &:hover {
            > i {
              display: block;
            }
          }
        `;
      }
    }}

    &.highlighted {
      border-radius: 3px;
      background-color: #e9eaeb;
      font-weight: 600;
    }
    &.highlighted,
    &.is-checked:hover {
      > i {
        display: block;
      }
    }
  }
`;

const Label = styled.label`
  margin-left: 9px;
  cursor: pointer;
  > input {
    display: none;
    margin-right: 9px;
  }
  &:before {
    content: '';
    position: absolute;
    left: 15px;
    top: 6px;
    width: 14px;
    height: 14px;
    border: 1px solid rgba(16, 22, 34, 0.15);
    background-color: #fdfdfd;
    border-radius: 3px;
  }
  &.checked {
    &:after {
      content: '\f00c';
      position: absolute;
      top: 0;
      left: 17px;
      font-size: 10px;
      font-family: 'FontAwesome';
      font-weight: 100;
      color: #1c5de7;
      transition: all 0.2s;
    }
    &:hover + i {
      display: block;
    }
  }
`;

export { Label, Wrapper };
