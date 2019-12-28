/**
 *
 * StyledListRow
 *
 */

import styled from 'styled-components';

import { colors } from 'strapi-helper-plugin';

const StyledListRow = styled.tr`
  background-color: transparent;
  p {
    margin-bottom: 0;
  }
  img {
    width: 35px;
  }
  button {
    cursor: pointer;
  }
  td:first-of-type {
    padding-left: 3rem;
    position: relative;
    img {
      width: 35px;
      height: 20px;
      position: absolute;
      top: calc(50% - 10px);
      left: 3rem;
    }
    img + p {
      width: 237px;
      padding-left: calc(3rem + 35px);
    }
  }
  td:nth-child(2) {
    width: 25rem;
    p {
      font-weight: 500;
      text-transform: capitalize;
    }
  }
  td:last-child {
    text-align: right;
  }
  &.relation-row {
    background: linear-gradient(
      135deg,
      rgba(28, 93, 231, 0.05),
      rgba(239, 243, 253, 0)
    );
  }
  &.clickable {
    &:hover {
      cursor: pointer;
      background-color: ${colors.grey};
      & + tr {
        &::before {
          background-color: transparent;
        }
      }
    }
  }
`;

export default StyledListRow;
