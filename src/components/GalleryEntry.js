import React from 'react';
import PropTypes from 'prop-types';

function GalleryEntry({ data }) {
  return (
    <div>{data}</div>
  );
}

GalleryEntry.propTypes = {
  data: PropTypes.string.isRequired,
};

export default GalleryEntry;
