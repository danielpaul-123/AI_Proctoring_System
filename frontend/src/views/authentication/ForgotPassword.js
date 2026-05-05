import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Button } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useForgotPasswordMutation } from './../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
});

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await forgotPassword({ email: values.email }).unwrap();
        toast.success(res.message || 'Email sent successfully. Check your console for the link!');
        formik.resetForm();
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to send email');
      }
    },
  });

  return (
    <PageContainer title="Forgot Password" description="this is Forgot Password page">
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
                Forgot Password
              </Typography>
              <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={3}>
                Please enter your email address to receive a password reset link.
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                <Stack>
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="email"
                      mb="5px"
                    >
                      Email Address
                    </Typography>
                    <CustomTextField
                      id="email"
                      name="email"
                      variant="outlined"
                      placeholder="Enter Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
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
                    Send Reset Link
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  Remember your password?
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

export default ForgotPassword;
