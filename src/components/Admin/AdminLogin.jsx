import React, { useEffect, useState } from 'react'
import '../../assets/auth.css'
import vitLogoWhite from "../../assets/vit-logo-white.png";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../api/axiosInstance';
import UseAlert from '../CustomeHooks/UseAlert';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { generateJwtToken } from '../../api/generateJwtToken';
import { encryptUserId } from '../../api/Crypto';

function AdminLogin() {
  const CustomeButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#2c476d"),
    textTransform: 'none',
    backgroundColor: "#2c476d",
    '&:hover': {
      backgroundColor: "#2c476d",
    },
  }));
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-box">

        <div className="auth-left">
          <div className="illustration">
            <img src={vitLogoWhite} alt="vit-logo" />
          </div>
        </div>

        <div className="auth-right">
          <div className="form-container">
            <div className="logo">
              <h2>VIT Chennai</h2>
              <p>Admin Login</p>
              <div className="loading">
                {loading && <LinearProgress />}
              </div>
            </div>

            <form>
              <TextField
                type="email"
                id="outlined-basic"
                label="Enter Your Email"
                variant="outlined"
                name='email'
              />
              <TextField
                type="text"
                id="outlined-basic"
                label="Enter Your Password"
                variant="outlined"
                name='otp'
              />
              <CustomeButton type='submit' variant="contained">LOGIN</CustomeButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin