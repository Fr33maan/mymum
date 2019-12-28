import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import { FormattedMessage } from 'react-intl';
import pluralize from 'pluralize';

import pluginId from '../../pluginId';

import oneWay from '../../assets/images/one_way.svg';
import oneWaySelected from '../../assets/images/one_way_selected.svg';
import oneToOne from '../../assets/images/one_to_one.svg';
import oneToOneSelected from '../../assets/images/one_to_one_selected.svg';
import oneToMany from '../../assets/images/one_to_many.svg';
import oneToManySelected from '../../assets/images/one_to_many_selected.svg';
import manyToOne from '../../assets/images/many_to_one.svg';
import manyToOneSelected from '../../assets/images/many_to_one_selected.svg';
import manyToMany from '../../assets/images/many_to_many.svg';
import manyToManySelected from '../../assets/images/many_to_many_selected.svg';
import manyWay from '../../assets/images/many_way.svg';
import manyWaySelected from '../../assets/images/many_way_selected.svg';

import NaturePickerWrapper from './NaturePickerWrapper';

const assets = {
  oneWay: {
    name: 'oneWay',
    icon: oneWay,
    iconSelected: oneWaySelected,
  },
  oneToOne: {
    name: 'oneToOne',
    icon: oneToOne,
    iconSelected: oneToOneSelected,
  },
  oneToMany: {
    name: 'oneToMany',
    icon: oneToMany,
    iconSelected: oneToManySelected,
  },
  manyToOne: {
    name: 'manyToOne',
    icon: manyToOne,
    iconSelected: manyToOneSelected,
  },
  manyToMany: {
    name: 'manyToMany',
    icon: manyToMany,
    iconSelected: manyToManySelected,
  },
  manyWay: {
    name: 'manyWay',
    icon: manyWay,
    iconSelected: manyWaySelected,
  },
};

const availableRelations = [
  'manyToMany',
  'oneToMany',
  'oneToOne',
  'oneWay',
  'manyWay',
];

/* eslint-disable indent */
const NaturePicker = ({ modelName, onClick, nature, target }) => {
  const { leftName, rightName } = availableRelations.includes(nature)
    ? {
        leftName: pluralize(modelName, nature === 'manyToMany' ? 2 : 1),
        rightName: pluralize(
          target,
          ['manyToMany', 'oneToMany', 'manyToOne', 'manyWay'].includes(nature)
            ? 2
            : 1
        ),
      }
    : {
        leftName: target,
        rightName: pluralize(
          modelName,
          ['manyToMany', 'oneToMany', 'manyToOne'].includes(nature) ? 2 : 1
        ),
      };

  return (
    <NaturePickerWrapper>
      <div className="relationNatureWrapper">
        {Object.keys(assets).map(iconName => {
          const src =
            iconName === nature
              ? assets[iconName].iconSelected
              : assets[iconName].icon;

          return (
            <img
              key={iconName}
              onClick={() => onClick(iconName, modelName)}
              src={src}
              alt={iconName}
            />
          );
        })}
      </div>
      <div className="infoContainer">
        <span>{truncate(leftName, { length: 24 })}</span>
        &nbsp; <FormattedMessage id={`${pluginId}.relation.${nature}`} /> &nbsp;
        <span>{truncate(rightName, { length: 24 })}</span>
      </div>
    </NaturePickerWrapper>
  );
};

NaturePicker.defaultProps = {
  modelName: '',
  nature: 'oneWay',
  onClick: () => {},
  target: '',
};

NaturePicker.propTypes = {
  modelName: PropTypes.string,
  nature: PropTypes.string,
  onClick: PropTypes.func,
  target: PropTypes.string,
};

export default NaturePicker;
