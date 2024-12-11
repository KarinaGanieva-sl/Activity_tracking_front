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

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const roles = ['Admin', 'Manager', 'Developer'];
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
        navigate('/dashboard/user', { replace: true });
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  const SignUp = () => {
    // Simple POST request with a JSON body using fetch
    const token = localStorage.getItem('token').replace(/['"]+/g, '');
    const auth = `Bearer ${token}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify({
        nickname: formik.values.nickName,
        password: formik.values.password,
        role: formik.values.role
      })
    };
    console.log(requestOptions.body);
    fetch('http://localhost:8080/users', requestOptions)
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
        window.location.reload();
      });
  };

  const RegisterSchema = Yup.object().shape({
    nickName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Nickname required'),
    role: Yup.string().required('Role required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      nickName: '',
      role: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      SignUp();
      updateData();
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            label="Nickname"
            {...getFieldProps('nickName')}
            error={Boolean(touched.nickName && errors.nickName)}
            helperText={touched.nickName && errors.nickName}
          />
          {/* <InputLabel id="label">Role</InputLabel> */}
          <Select labelId="label" {...getFieldProps('role')}>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add user
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
