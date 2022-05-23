import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import './ResetPasswordAfterEmail.scss';
import ResetPasswordForm from "../../components/ResetPasswordFormAfterEmail";
import ResetPasswordFormSuccess from "../../components/ResetPasswordFormAfterEmail/ResetPasswordFormSuccess";
import Footer from "../../components/Footer";

const ResetPasswordAfterEmail = ({onLogin}) => {
  const [sendNewPasswordState, setSend] = useState(false);
  const sendMessage = () => {
    setSend(true);
  }
  return (
    <>
    <Grid className="body_auth_main" container justify="center">
      <Grid className="grid_options" item xs={6} >
        {!sendNewPasswordState ? <ResetPasswordForm sendMessage={sendMessage}/> : <ResetPasswordFormSuccess/>}
      </Grid>
    </Grid>
    <Footer />
  </>
  );
};

export default ResetPasswordAfterEmail;
