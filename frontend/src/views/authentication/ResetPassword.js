import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Button } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useResetPasswordMutation } from './../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';

const validationSchema = yup.object({
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await resetPassword({ token, password: values.password }).unwrap();
        toast.success(res.message || 'Password reset successfully');
        navigate('/auth/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to reset password');
      }
    },
  });

  return (
    <PageContainer title="Reset Password" description="this is Reset Password page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography
                  variant="h4"
                  component="h1"
                  style={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    margin: '20px 0',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  AI_Evalu8
                </Typography>
              </Box>
              
              <Typography fontWeight="700" variant="h3" mb={1} textAlign="center">
                Reset Password
              </Typography>
              <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={3}>
                Please enter your new password.
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                <Stack>
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="password"
                      mb="5px"
                    >
                      New Password
                    </Typography>
                    <CustomTextField
                      id="password"
                      name="password"
                      type="password"
                      variant="outlined"
                      placeholder="Enter New Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      fullWidth
                    />
                  </Box>
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="confirmPassword"
                      mb="5px"
                    >
                      Confirm Password
                    </Typography>
                    <CustomTextField
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      variant="outlined"
                      placeholder="Confirm New Password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                      fullWidth
                    />
                  </Box>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                  >
                    Reset Password
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  Back to
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Sign In
                </Typography>
                {isLoading && <Loader />}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ResetPassword;
