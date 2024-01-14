import React from 'react'
import { Link, ListItem } from '@mui/material'

interface ResourceProps {
  title: string
  link: string
}

function Resource ({ title, link }: ResourceProps): JSX.Element {
  return (
    <ListItem>
      <Link
        href={link}
        underline="hover"
      >
        {title}
      </Link>
    </ListItem>
  )
}

export default Resource
