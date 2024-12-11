import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

export default function SettingsForm() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userData'));
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
        console.log(response);
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
  const editInfo = () => {
    // Simple POST request with a JSON body using fetch
    const token = localStorage.getItem('token').replace(/['"]+/g, '');
    const auth = `Bearer ${token}`;

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify({
        nickname: user.nickname,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email
      })
    };
    console.log(requestOptions.body);
    fetch('http://localhost:8080/account/update', requestOptions)
      .then(async (response) => {
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = response.statusText;
          return Promise.reject(error);
        }
        user.firstName = formik.values.firstName;
        user.lastName = formik.values.lastName;
        user.email = formik.values.email;
        localStorage.setItem('userData', JSON.stringify(user));
        alert('Information was successfully updated!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('There was an error!', error);
        window.location.reload();
      });
  };

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });
  const formik = useFormik({
    initialValues: {
      firstName: user.firstName == null ? '' : user.firstName,
      lastName: user.lastName == null ? '' : user.lastName,
      email: user.email == null ? '' : user.email
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      editInfo();
      //   updateData();
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  updateData();
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update information
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
