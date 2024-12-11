import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  InputAdornment
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));
const DivStyle = styled('div')(({ theme }) => ({
  width: '95%',
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 auto'
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
const CustomSelect = styled(Select)(({ theme }) => ({
  minWidth: 150,
  width: '82%'
}));
// ----------------------------------------------------------------------

TeamListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  id: PropTypes.number
};
const addUser = (id, value) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');

  const auth = `Bearer ${token}`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify({
      user: value
    })
  };
  console.log(requestOptions.body);
  fetch(`http://localhost:8080/projects/${id}/add_user?user=${value}`, requestOptions)
    .then(async (response) => {
      const data = await response;

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
const getUsers = (id, setUsers, setLoading) => {
  const token = localStorage.getItem('token').replace(/['"]+/g, '');

  const auth = `Bearer ${token}`;
  console.log(auth);
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  };
  fetch(`http://localhost:8080/projects/${id}/free_users`, requestOptions)
    .then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      setUsers(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function TeamListToolbar({ numSelected, filterName, onFilterName, id }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  if (loading) getUsers(id, setUsers, setLoading);
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <DivStyle>
          <CustomSelect
            labelId="label"
            disabled={loading}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          >
            {users.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.nickname}
              </MenuItem>
            ))}
          </CustomSelect>
          )}
          {localStorage.getItem('role').replace(/['"]+/g, '') !== 'Developer' && (
            <Button variant="contained" onClick={() => addUser(id, value)}>
              Add User to Project
            </Button>
          )}
        </DivStyle>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )} */}
    </RootStyle>
  );
}
