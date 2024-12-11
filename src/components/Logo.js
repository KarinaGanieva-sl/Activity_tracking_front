import PropTypes from 'prop-types';
// material
import { Box } from '@material-ui/core';
import mainLogo from '../static/logo.svg';
// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src={mainLogo} sx={{ width: 40, height: 40, ...sx }} />;
}
