/**
 *
 * EditViewLink
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { LiLink } from 'strapi-helper-plugin';

// Create link from content-type-builder to content-manager
function EditViewLink(props) {
  // Retrieve URL from props
  const base = `${props.getContentTypeBuilderBaseUrl()}${props.getModelName()}`;
  const url =
    props.getSource() === 'users-permissions'
      ? `${base}&source=${props.getSource()}`
      : base;

  if (props.getSource() === 'admin') {
    return null;
  }

  if (props.currentEnvironment === 'development') {
    return <LiLink {...props} url={url} />;
  }

  return null;
}

EditViewLink.propTypes = {
  currentEnvironment: PropTypes.string.isRequired,
  getContentTypeBuilderBaseUrl: PropTypes.func.isRequired,
  getModelName: PropTypes.func.isRequired,
  getSource: PropTypes.func.isRequired,
};

export default EditViewLink;
