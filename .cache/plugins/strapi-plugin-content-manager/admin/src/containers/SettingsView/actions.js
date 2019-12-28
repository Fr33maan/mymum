import {
  GET_DATA,
  GET_DATA_SUCCEEDED,
  ON_CHANGE,
  ON_RESET,
  ON_SUBMIT,
  SUBMIT_SUCCEEDED,
} from './constants';

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSucceeded(generalSettings) {
  return {
    type: GET_DATA_SUCCEEDED,
    generalSettings,
  };
}

export function onChange({ target: { name, value } }) {
  return {
    type: ON_CHANGE,
    name,
    value: name === 'pageSize' ? parseInt(value, 10) : value,
  };
}

export function onReset() {
  return {
    type: ON_RESET,
  };
}

export function onSubmit() {
  return {
    type: ON_SUBMIT,
  };
}

export function submitSucceeded() {
  return {
    type: SUBMIT_SUCCEEDED,
  };
}
