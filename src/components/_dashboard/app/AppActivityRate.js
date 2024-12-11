import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import taskListAdd24Filled from '@iconify/icons-fluent/task-list-add-24-filled'; // material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------
AppActivityRate.propTypes = {
  id: PropTypes.number,
  isProject: PropTypes.bool
};

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
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
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------
const secondDay = new Date('2021-08-13');
const firstDay = new Date(secondDay - 7 * 24 * 60 * 60 * 1000);
const userRate = (id, setRate) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(
    `http://localhost:8080/sessions/get_activity_by_uper/?user=${id}&first_day=${firstDay
      .toISOString()
      .slice(0, 10)}&second_day=${secondDay.toISOString().slice(0, 10)}`,
    requestOptions
  )
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      setRate(data * 100);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
const projectRate = (id, setRate) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(`http://localhost:8080/sessions/get_activity_by_p/?project=${id}`, requestOptions)
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      setRate(data * 100);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function AppActivityRate({ id, isProject }) {
  const [rate, setRate] = useState(0);
  if (isProject) projectRate(id, setRate);
  else userRate(id, setRate);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={taskListAdd24Filled} width={30} height={30} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(rate)}%</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Activity rate
      </Typography>
    </RootStyle>
  );
}
