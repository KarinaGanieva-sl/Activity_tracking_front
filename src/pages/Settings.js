import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Card, Link, Container, Typography, Stack } from '@material-ui/core';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { SettingsForm } from '../components/_dashboard/settings';
import RegisterLogo from '../static/illustrations/illustration_register.png';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  minHeight: '60vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4, 0)
}));

// ----------------------------------------------------------------------

export default function Settings() {
  return (
    <RootStyle title="Settings | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
        </Stack>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Get started absolutely free.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Free forever. No credit card needed.
            </Typography>
          </Box>
          <SettingsForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
