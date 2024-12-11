// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import Carousel from 'react-images';
// components
import Page from '../components/Page';
import {
  AppProjectsNum,
  AppWorkedThisWeek,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentSubject,
  AppConversionRates,
  AppActivityRate
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function UserInfo() {
  const images = [
    { source: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Shelby_GT500KR_at_NYIAS.jpg' },
    { source: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Shelby_GT500KR_at_NYIAS.jpg' }
  ];
  const id = parseInt(window.location.href.split('/')[5], 10);
  const user = JSON.parse(localStorage.getItem('users')).find((value, index, array) => {
    if (value.id === id) return true;
    return false;
  });
  return (
    <Page title={`User ${user.nickname} | Minimal-UI`}>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            {user.nickname} ({user.role})
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <AppWorkedThisWeek id={user.id} isProject={false} />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <AppProjectsNum id={user.id} />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <AppActivityRate id={user.id} isProject={false} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppWebsiteVisits id={user.id} isProject={false} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
