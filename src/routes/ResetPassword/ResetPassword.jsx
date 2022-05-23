import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import './ResetPassword.scss';
import ResetPasswordForm from "../../components/ResetPasswordForm";
import ResetPasswordFormSuccess from "../../components/ResetPasswordForm/ResetPasswordFormSuccess";
import Footer from "../../components/Footer";

const ResetPassword = ({onLogin}) => {
  const [sendState, setSend] = useState(false);
  const sendMessage = () => {
    setSend(true);
  }
  return (
    <>
    <Grid className="body_auth_main" container justify="center">
      <Grid className="grid_options" item xs={6} >
        {!sendState ? <ResetPasswordForm sendMessage={sendMessage}/> : <ResetPasswordFormSuccess/>}
      </Grid>
    </Grid>
    <Footer />
  </>
  );
};

export default ResetPassword;
