/* eslint-disable no-console */
import pluralize from 'pluralize';
import { capitalize, get, sortBy } from 'lodash';
import { all, fork, takeLatest, call, put } from 'redux-saga/effects';
import { request } from 'strapi-helper-plugin';
import pluginId from '../../pluginId';

import {
  getDataSucceeded,
  deleteModelSucceeded,
  submitContentTypeSucceeded,
  submitGroupSucceeded,
  submitTempContentTypeSucceeded,
  submitTempGroupSucceeded,
  deleteGroupSucceeded,
} from './actions';
import {
  GET_DATA,
  DELETE_GROUP,
  DELETE_MODEL,
  SUBMIT_CONTENT_TYPE,
  SUBMIT_GROUP,
  SUBMIT_TEMP_CONTENT_TYPE,
  SUBMIT_TEMP_GROUP,
} from './constants';

const getRequestUrl = path => `/${pluginId}/${path}`;

export function* getData() {
  try {
    const [data, { connections }, groups] = yield all([
      call(request, getRequestUrl('models'), { method: 'GET' }),
      call(request, getRequestUrl('connections'), { method: 'GET' }),
      call(request, getRequestUrl('groups'), { method: 'GET' }),
    ]);

    yield put(getDataSucceeded(data, connections, groups));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* deleteGroup({ uid }) {
  try {
    const response = yield call(
      request,
      getRequestUrl(`groups/${uid}`),
      { method: 'DELETE' },
      true
    );
    const { data } = response;

    if (data.uid === uid) {
      strapi.notification.success(
        `${pluginId}.notification.success.groupDeleted`
      );
      yield put(deleteGroupSucceeded(uid));
    }
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* deleteModel({
  context: { plugins, updatePlugin },
  modelName,
}) {
  try {
    const response = yield call(
      request,
      getRequestUrl(`models/${modelName}`),
      { method: 'DELETE' },
      true
    );

    if (response.ok === true) {
      strapi.notification.success(
        `${pluginId}.notification.success.contentTypeDeleted`
      );
      yield put(deleteModelSucceeded(modelName));

      const appPlugins = plugins;
      const appMenu = get(
        appPlugins,
        ['content-manager', 'leftMenuSections'],
        [{ links: [] }]
      );
      const updatedMenu = appMenu[0].links.filter(el => {
        return el.uid !== modelName;
      });
      appMenu[0].links = sortBy(updatedMenu, 'label');
      updatePlugin('content-manager', 'leftMenuSections', appMenu);
    }
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* submitCT({
  oldContentTypeName,
  body,
  source,
  context: { emitEvent, plugins, history, updatePlugin },
}) {
  try {
    const { name } = body;

    if (source) {
      body.plugin = source;
    }

    emitEvent('willSaveContentType');

    const opts = { method: 'PUT', body };

    yield call(
      request,
      getRequestUrl(`models/${oldContentTypeName}`),
      opts,
      true
    );
    emitEvent('didSaveContentType');
    yield put(submitContentTypeSucceeded());
    const suffixUrl = source ? `&source=${source}` : '';
    history.push(`/plugins/${pluginId}/models/${name}${suffixUrl}`);

    if (name !== oldContentTypeName) {
      emitEvent('didEditNameOfContentType');

      const appPlugins = plugins.toJS ? plugins.toJS() : plugins;
      const appMenu = get(
        appPlugins,
        ['content-manager', 'leftMenuSections'],
        []
      );
      const oldContentTypeNameIndex = appMenu[0].links.findIndex(
        el => el.uid === oldContentTypeName
      );
      const updatedLink = {
        uid: name.toLowerCase(),
        label: capitalize(pluralize(name)),
      };
      appMenu[0].links.splice(oldContentTypeNameIndex, 1, updatedLink);
      appMenu[0].links = sortBy(appMenu[0].links, 'label');
      updatePlugin('content-manager', 'leftMenuSections', appMenu);
    }
  } catch (error) {
    const errorMessage = get(
      error,
      ['response', 'payload', 'message', '0', 'messages', '0', 'id'],
      'notification.error'
    );
    strapi.notification.error(errorMessage);
  }
}

export function* submitGroup({
  oldGroupName,
  body,
  source,
  context: { emitEvent, history },
}) {
  try {
    if (source) {
      body.plugin = source;
    }

    emitEvent('willSaveGroup');

    const opts = { method: 'PUT', body };

    const {
      data: { uid },
    } = yield call(
      request,
      getRequestUrl(`groups/${oldGroupName}`),
      opts,
      true
    );
    emitEvent('didSaveGroup');

    yield put(submitGroupSucceeded());

    const suffixUrl = source ? `&source=${source}` : '';
    history.push(`/plugins/${pluginId}/groups/${uid}${suffixUrl}`);
  } catch (error) {
    const errorMessage = get(
      error,
      ['response', 'payload', 'message', '0', 'messages', '0', 'id'],
      'notification.error'
    );
    strapi.notification.error(errorMessage);
  }
}

/* istanbul ignore-next */
export function* submitTempCT({
  body,
  context: { emitEvent, plugins, updatePlugin },
}) {
  try {
    emitEvent('willSaveContentType');

    const opts = { method: 'POST', body };

    yield call(request, getRequestUrl('models'), opts, true);

    emitEvent('didSaveContentType');
    yield put(submitTempContentTypeSucceeded());

    const { name } = body;
    const appPlugins = plugins;
    const appMenu = get(
      appPlugins,
      ['content-manager', 'leftMenuSections'],
      []
    );
    const newLink = {
      uid: name.toLowerCase(),
      label: capitalize(pluralize(name)),
    };
    appMenu[0].links.push(newLink);
    appMenu[0].links = sortBy(appMenu[0].links, 'label');

    updatePlugin('content-manager', 'leftMenuSections', appMenu);
  } catch (error) {
    const errorMessage = get(
      error,
      ['response', 'payload', 'message', '0', 'messages', '0', 'id'],
      'notification.error'
    );
    strapi.notification.error(errorMessage);
  }
}

/* istanbul ignore-next */
export function* submitTempGroup({ body, context: { emitEvent } }) {
  try {
    emitEvent('willSaveGroup');

    const opts = { method: 'POST', body };

    yield call(request, getRequestUrl('groups'), opts, true);

    emitEvent('didSaveGroup');
    yield put(submitTempGroupSucceeded());
  } catch (error) {
    const errorMessage = get(
      error,
      ['response', 'payload', 'message', '0', 'messages', '0', 'id'],
      'notification.error'
    );
    strapi.notification.error(errorMessage);
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  try {
    yield all([
      fork(takeLatest, GET_DATA, getData),
      fork(takeLatest, DELETE_GROUP, deleteGroup),
      fork(takeLatest, DELETE_MODEL, deleteModel),
      fork(takeLatest, SUBMIT_CONTENT_TYPE, submitCT),
      fork(takeLatest, SUBMIT_GROUP, submitGroup),
      fork(takeLatest, SUBMIT_TEMP_CONTENT_TYPE, submitTempCT),
      fork(takeLatest, SUBMIT_TEMP_GROUP, submitTempGroup),
    ]);
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}
