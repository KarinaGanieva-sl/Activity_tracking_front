import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import peopleTeam24Filled from '@iconify/icons-fluent/people-team-24-filled';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------
AppUserWorked.propTypes = {
  id: PropTypes.number
};

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const userWorked = (id, setUsers) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');

  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(`http://localhost:8080/projects/${id}/users`, requestOptions)
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      setUsers(data.length);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function AppUserWorked({ id }) {
  const [users, setUsers] = useState(0);
  userWorked(id, setUsers);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={peopleTeam24Filled} width={30} height={30} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(users)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Users worked
      </Typography>
    </RootStyle>
  );
}
