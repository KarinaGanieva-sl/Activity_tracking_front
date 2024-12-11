import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import Carousel from 'react-images';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// material
import {
  Card,
  CardHeader,
  Box,
  Toolbar,
  Icon,
  Button,
  Typography,
  OutlinedInput,
  Stack,
  MenuItem,
  Select,
  Paper
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

// получаем проекты пользователя
const userProjects = (id, setProjects, setLoading, setValue) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  console.log(`получаем проекты пользователя с ${id}`);

  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(`http://localhost:8080/projects/i_consist_in`, requestOptions)
    .then(async (response) => {
      const data = await response.json();
      console.log('1');
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      setProjects(data);
      console.log(`получили проекты ${data}`);
      setLoading(false);
      setValue(data[0]);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};

// получаем участников конткретного проекта
const team = (id, setProjects, setLoading) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  console.log(`получаем пользователей проекта с id: ${id}`);
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
      setProjects(data);
      console.log(`зачем-от установили в проекты:${data}`);
      setLoading(false);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};

// получить информацию об активности пользователя по проекту в период времени
const getData = (id, value, firstDay, secondDay, setChartData, setLoaded) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  console.log(`получаем инфу по user_id ${id} проект ${value}`);
  console.log(`start date: ${firstDay} second date:${secondDay}`);

  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  setLoaded(false);
  fetch(
    `http://localhost:8080/sessions/get_work_time_by_upper/?user=${id}&project=${value}&first_day=${firstDay
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
      setChartData(data.allDays);
      console.log(`установили в chartData:${data.allDays}`);
      setLoaded(true);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};

// получаем сессии по дате, пользователю и проекту, из сессии получаем скриншоты и session part
const getSingleData = (id, value, date, setChartData, setLoaded, setScreenshots) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  console.log(`получаем инфу по пользователю id: ${id} project: ${value}`);
  console.log(`date ${date}`);
  const auth = `Bearer ${token}`;
  // console.log(`${id} ${value} ${date.toISOString().slice(0, 10)}`);
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  setLoaded(false);
  fetch(
    `http://localhost:8080/sessions/get_by_upd/?user=${id}&project=${value}&date=${date
      .toISOString()
      .slice(0, 10)}`,
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
      if (data.length) {
        // получаем массив {session parts, session parts, ...}
        let arr = data.map((item) => item.sessionParts);
        const chartData = [];
        const screenshots = [];
        // добавляем информацию о каждой session part
        arr.map((item) => chartData.push(...item));
        setChartData(chartData);
        arr = data.map((item) => item.screenshots);
        // добавляем скриншоты по каждой сессиии
        arr.map((item) => screenshots.push(...item));
        arr = [];
        screenshots.map((item) => arr.push({ source: `data:image/jpeg;base64,${item.data}` }));
        // console.log(arr);
        setScreenshots(arr);
        // console.log(screenshots);
        setLoaded(true);
        console.log(`screenshots: ${arr}`);
        console.log(`chartData: ${chartData}`);
      }
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: '#fff', width: 250, padding: 20, border: '2px solid #ad2c30' }}
      >
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Work time: ${payload[0].value} hours`}</p>
        <p className="desc">{`Activity rate: ${payload[0].payload.activity * 100}%`}</p>
      </div>
    );
  }

  return null;
};
const CustomDayTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: '#fff', width: 250, padding: 20, border: '2px solid #ad2c30' }}
      >
        <p className="label">{`${value.date} ${label}`}</p>
        <p className="intro">{`Activity rate: ${value.averageActivity * 100} %`}</p>
        <p className="desc">{`Keys clicked: ${value.keyClick}`}</p>
        <p className="desc">{`Mouse clicked: ${value.mouseClick}`}</p>
        <p className="desc">{`Mouse moved: ${value.mouseMove}`}</p>
      </div>
    );
  }

  return null;
};
export default function AppProjectsWorkedTimeStatistics({ id, isProject }) {
  const [chartData, setChartData] = useState([]);
  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));
  const Filter = styled(Stack)(({ theme }) => ({
    height: 40,
    alignItems: 'center',
    width: '60%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));
  const CustomSelect = styled(Select)(({ theme }) => ({
    minWidth: 150,
    margin: theme.spacing(0, 5, 0, 3)
  }));
  const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  }));
  const [startDate, setStartDate] = useState(new Date(2023, 3, 26));
  const [endDate, setEndDate] = useState(startDate);
  const [projects, setProjects] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState();
  const [loaded, setLoaded] = useState(false);
  const isEqual = () => startDate.toISOString().slice(0, 10) === endDate.toISOString().slice(0, 10);
  console.log('заходим');
  const chartRender = () => {
    if (isEqual()) {
      console.log('Render chart equal');
      return (
        <ResponsiveContainer width="99%" height={400}>
          <AreaChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="startTime" />
            <YAxis />
            <Tooltip content={<CustomDayTooltip />} />
            <Area type="monotone" dataKey="averageActivity" stroke="#007b54" fill="#a5e4b8" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    console.log('Render chart');
    return (
      <ResponsiveContainer width="99%" height={400}>
        <AreaChart
          width={500}
          height={400}
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="workTime" stroke="#007b54" fill="#a5e4b8" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  const screenshotsRender = () => {
    console.log(`screenshots render, screen ${screenshots.length}`);
    if (isEqual() && screenshots.length)
      return (
        <Box sx={{ pb: 2, pt: 5, m: 5, mt: 0, mb: 0 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Screenshots
          </Typography>
          <Carousel views={screenshots} />
        </Box>
      );
  };
  if (loading) {
    if (isProject) team(id, setProjects, setLoading);
    else userProjects(id, setProjects, setLoading, setValue);
  }

  return (
    <Card>
      <RootStyle>
        <CardHeader title="Activity" subheader="(+43%) than last year" />
        <Filter direction="row" alignItems="center" justifyContent="space-between" mt={5}>
          {console.log('111111')}
          <CustomSelect
            disabled={loading}
            defaultValue={value}
            onChange={(e) => setValue(e.target.value)}
          >
            {isProject
              ? projects.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nickname}
                  </MenuItem>
                ))
              : projects.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
          </CustomSelect>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          <Button
            variant="contained"
            onClick={() => {
              setScreenshots([]);
              if (!isEqual() && value > 0 && !isProject) {
                getData(id, value, startDate, endDate, setChartData, setLoaded);
              } else if (!isEqual() && value > 0 && isProject) {
                getData(value, id, startDate, endDate, setChartData, setLoaded);
              } else if (isEqual() && value > 0 && !isProject) {
                getSingleData(id, value, startDate, setChartData, setLoaded, setScreenshots);
              } else if (isEqual() && value > 0 && isProject) {
                getSingleData(value, id, startDate, setChartData, setLoaded, setScreenshots);
              }
            }}
          >
            Filter
          </Button>
        </Filter>
      </RootStyle>
      <Box sx={{ p: 3, pb: 2 }} dir="ltr">
        {loaded ? (
          chartRender()
        ) : (
          <Paper sx={{ p: 9 }}>
            <Typography gutterBottom align="center" variant="subtitle1">
              Use filter to analize chart data
            </Typography>
            <Typography variant="body2" align="center">
              Select the dates of the period to be analyzed and the corresponding project or user
            </Typography>
          </Paper>
        )}
      </Box>
      {screenshotsRender()}
    </Card>
  );
}
