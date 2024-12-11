// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import { useState } from 'react';
import Page from '../components/Page';
import {
  AppWorkedThisWeek,
  AppOrderTimeline,
  AppCurrentVisits,
  AppCurrentSubject,
  AppConversionRates,
  AppProjectsNum,
  AppProjectsWorkedTimeStatistics
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------
const updateProjects = () => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch('http://localhost:8080/projects', requestOptions)
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      localStorage.setItem('projects', JSON.stringify(data));
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
const updateUsers = () => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch('http://localhost:8080/users', requestOptions)
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      localStorage.setItem('users', JSON.stringify(data));
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function DashboardApp() {
  // updateProjects();
  // updateUsers();
  const [id, setId] = useState(JSON.parse(localStorage.getItem('userData')).id);
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWorkedThisWeek id={id} isProject={false} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppProjectsNum id={id} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppProjectsWorkedTimeStatistics id={id} isProject={false} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}> */}
          {/*  <AppCurrentVisits /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}> */}
          {/*  <AppCurrentSubject /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}> */}
          {/*  <AppOrderTimeline /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={12} lg={12}> */}
          {/*  <AppConversionRates /> */}
          {/* </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
