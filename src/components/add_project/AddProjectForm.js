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

export default function AddProjectForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const updateData = () => {
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
        navigate('/dashboard/projects', { replace: true });
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  const addProject = () => {
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
        name: formik.values.name,
        description: formik.values.description,
        screenshotInterval: formik.values.screenshotInterval,
        sessionPartInterval: formik.values.sessionPartInterval
      })
    };
    console.log(requestOptions.body);
    fetch('http://localhost:8080/projects', requestOptions)
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
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Name of project required'),
    description: Yup.string().required('Description required'),
    sessionPartInterval: Yup.number('Must be number!')
      .required('Interval required')
      .positive('Number must be positive!')
      .integer('Number must be integer'),
    screenshotInterval: Yup.number('Must be number!')
      .required('Interval required')
      .positive('Number must be positive!')
      .integer('Number must be integer')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      sessionPartInterval: 10,
      screenshotInterval: 10
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      addProject();
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
            label="Name of project"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            autoComplete="username"
            label="Description of project"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />

          {/* <TextField
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
          /> */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Interval of screenshots"
              {...getFieldProps('screenshotInterval')}
              error={Boolean(touched.screenshotInterval && errors.screenshotInterval)}
              helperText={touched.screenshotInterval && errors.screenshotInterval}
            />

            <TextField
              fullWidth
              label="Interval of sessions"
              {...getFieldProps('sessionPartInterval')}
              error={Boolean(touched.sessionPartInterval && errors.sessionPartInterval)}
              helperText={touched.sessionPartInterval && errors.sessionPartInterval}
            />
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add project
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
