import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import pluginId from '../../pluginId';
import Form from './Form';
import { NonRepeatableWrapper, P } from './components';

const NonRepeatableGroup = ({
  addField,
  isInitialized,
  fields,
  modifiedData,
  name,
  layout,
  onChange,
}) => {
  if (!isInitialized) {
    return (
      <NonRepeatableWrapper isEmpty onClick={() => addField(name, false)}>
        <div />
        <FormattedMessage id={`${pluginId}.components.Group.empty.repeatable`}>
          {msg => <P style={{ paddingTop: 75 }}>{msg}</P>}
        </FormattedMessage>
      </NonRepeatableWrapper>
    );
  }

  return (
    <NonRepeatableWrapper>
      {fields.map((fieldRow, key) => {
        return (
          <div className="row" key={key}>
            {fieldRow.map(field => {
              const keys = `${name}.${field.name}`;

              return (
                <Form
                  key={keys}
                  modifiedData={modifiedData}
                  keys={keys}
                  fieldName={field.name}
                  layout={layout}
                  onChange={onChange}
                />
              );
            })}
          </div>
        );
      })}
    </NonRepeatableWrapper>
  );
};

NonRepeatableGroup.defaultProps = {};
NonRepeatableGroup.propTypes = {
  addField: PropTypes.func.isRequired,
  isInitialized: PropTypes.bool,
  fields: PropTypes.array,
  modifiedData: PropTypes.object,
  name: PropTypes.string.isRequired,
  layout: PropTypes.object,
  onChange: PropTypes.func,
};

export default memo(NonRepeatableGroup);
