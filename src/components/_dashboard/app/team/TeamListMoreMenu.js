import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
// import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import personRemoveFill from '@iconify/icons-eva/person-remove-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// ----------------------------------------------------------------------
TeamListMoreMenu.propTypes = {
  id: PropTypes.number,
  userId: PropTypes.number
};

const deleteUser = (id, userId) => {
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
  fetch(`http://localhost:8080/projects/${id}/delete_user?user=${userId}`, requestOptions)
    .then(async (response) => {
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = response.statusText;
        return Promise.reject(error);
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
export default function TeamListMoreMenu({ id, userId }) {
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
            if (window.confirm('Are you sure you want to remove a user from this project?'))
              deleteUser(id, userId);
          }}
        >
          <ListItemIcon>
            <Icon icon={personRemoveFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Remove user" primaryTypographyProps={{ variant: 'body2' }} />
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
