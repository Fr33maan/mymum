/*
 *
 * DownloadInfo
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Content, Wrapper } from './components';
import Icon from '../../assets/icons/icon_success.svg';

function DownloadInfo() {
  return (
    <Wrapper>
      <Content>
        <img src={Icon} alt="info" />
        <div>
          <FormattedMessage id="app.components.DownloadInfo.download" />
          <br />
          <FormattedMessage id="app.components.DownloadInfo.text" />
        </div>
      </Content>
    </Wrapper>
  );
}

export default DownloadInfo;
