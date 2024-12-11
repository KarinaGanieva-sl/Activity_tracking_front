import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
// import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// ----------------------------------------------------------------------
UserMoreMenu.propTypes = {
  id: PropTypes.number
};
const updateData = () => {
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
      window.location.reload();
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};

const deleteUser = (id) => {
  // Simple POST request with a JSON body using fetch
  const token = localStorage.getItem('token').replace(/['"]+/g, '');
  const auth = `Bearer ${token}`;

  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: auth
    }
  };
  //  alert(`http://localhost:8080/users/${id}`);
  fetch(`http://localhost:8080/users/${id}`, requestOptions)
    .then(async (response) => {
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = response.statusText;
        return Promise.reject(error);
      }
      updateData();
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function UserMoreMenu({ id }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete a user?')) deleteUser(id);
          }}
        >
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {/* <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
      </Menu>
    </>
  );
}
