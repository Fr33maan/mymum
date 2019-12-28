/**
 *
 * LeftMenu
 *
 */

import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { StyledLeftMenu } from 'strapi-helper-plugin';

import cn from 'classnames';

import pluginId from '../../pluginId';

import CustomLink from '../../components/CustomLink';
import DocumentationSection from '../../components/DocumentationSection';
import MenuContext from '../../containers/MenuContext';
import LeftMenuLink from '../../components/LeftMenuLink';

const displayNotificationCTNotSaved = () =>
  strapi.notification.info(
    `${pluginId}.notification.info.contentType.creating.notSaved`
  );

const getSectionTitle = (itemsTitle, count) => {
  const base = `${pluginId}.menu.section.${itemsTitle}.name.`;

  return count > 1 ? `${base}plural` : `${base}singular`;
};

function LeftMenu() {
  const { canOpenModal, groups, models, push } = useContext(MenuContext);

  const handleClickOpenModalCreateCT = type => {
    if (canOpenModal) {
      push({
        search: `modalType=${type}&settingType=base&actionType=create`,
      });
    } else {
      displayNotificationCTNotSaved();
    }
  };

  const renderLinks = (param, items) => {
    const links = items.map(item => {
      const { isTemporary, name, source, uid } = item;
      const base = `/plugins/${pluginId}/${param}/${uid || name}`;
      const to = source ? `${base}&source=${source}` : base;

      return (
        <li key={name}>
          <LeftMenuLink
            isTemporary={isTemporary}
            name={name}
            source={source}
            to={to}
          />
        </li>
      );
    });
    return links;
  };

  return (
    <StyledLeftMenu className={cn('col-md-3')}>
      <section>
        <h3>
          <FormattedMessage id={getSectionTitle('models', models.length)} />
        </h3>
        <ul className="menu-list">
          {renderLinks('models', models)}
          <li>
            <CustomLink
              featureType="contentType"
              onClick={() => handleClickOpenModalCreateCT('model')}
            />
          </li>
        </ul>
      </section>
      <section>
        <h3>
          <FormattedMessage id={getSectionTitle('groups', groups.length)} />
        </h3>
        <ul className="menu-list">
          {renderLinks('groups', groups)}
          <li>
            <CustomLink
              featureType="group"
              onClick={() => handleClickOpenModalCreateCT('group')}
            />
          </li>
        </ul>
      </section>
      <section>
        <h3>
          <FormattedMessage
            id={`${pluginId}.menu.section.documentation.name`}
          />
        </h3>
        <DocumentationSection />
      </section>
    </StyledLeftMenu>
  );
}

export default LeftMenu;
export { getSectionTitle };
