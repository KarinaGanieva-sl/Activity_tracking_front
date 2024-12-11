import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import fieldTimeOutlined from '@iconify-icons/ant-design/field-time-outlined';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { setHours } from 'date-fns';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

/*
Показывает, в скольких проектах состоит пользователь (у суперадмина пока 0)
 */

AppWorkedThisWeek.propTypes = {
  id: PropTypes.number,
  isProject: PropTypes.bool
};
const secondDay = new Date();
const firstDay = new Date(secondDay - 7 * 24 * 60 * 60 * 1000);
const userWork = (id, setWorkTime) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(
    `http://localhost:8080/sessions/get_work_time_by_uper/?user=${id}&first_day=${firstDay
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
      setWorkTime(data.total);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
const projectWork = (id, setWorkTimeThisWeek) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(
    `http://localhost:8080/sessions/get_work_time_by_pper/?project=${id}&first_day=${firstDay
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
      setWorkTimeThisWeek(data.total);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function AppWorkedThisWeek({ id, isProject }) {
  const [workTime, setWorkTimeThisWeek] = useState(0);
  if (isProject) projectWork(id, setWorkTimeThisWeek);
  else userWork(id, setWorkTimeThisWeek);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={fieldTimeOutlined} width={30} height={30} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(workTime)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Worked this week
      </Typography>
    </RootStyle>
  );
}
