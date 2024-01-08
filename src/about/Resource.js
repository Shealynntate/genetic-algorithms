import React from 'react';
import PropTypes from 'prop-types';
import { Link, ListItem } from '@mui/material';

function Resource({ title, link }) {
  return (
    <ListItem>
      <Link
        href={link}
        underline="hover"
      >
        {title}
      </Link>
    </ListItem>
  );
}

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Resource;
