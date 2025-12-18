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

function Login() {
    const CustomeButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#2c476d"),
        textTransform: 'none',
        backgroundColor: "#2c476d",
        '&:hover': {
            backgroundColor: "#2c476d",
        },
    }));
    const navigate = useNavigate()
    const { showButtonAlert } = UseAlert();
    const [loading, setLoading] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errorsInput, setErrorsInput] = useState({});
    const [userInputField, setUserInputField] = useState({
        email: '',
        otp: ''
    })
    const handelUser = (e) => {
        const { value, name } = e.target
        setUserInputField((prevState) => {
            return (
                {
                    ...prevState,
                    [name]: value
                }
            )
        })
    }
    const validateForm = () => {
        const newErrors = {};
        if (!userInputField.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userInputField.email)
        ) {
            newErrors.email = "Invalid email address";
        }
        setErrorsInput(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleGenerateOtp = async () => {
        if (!validateForm()) {
            toast.error("Please fill email id correctly before generating OTP.")
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post("/auth/sendOtp/login", {
                emailId: userInputField.email,
            });
            console.log("OTP API Response:", response.data);
            showButtonAlert({
                title: "success",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "Ok",
            });
            // showSuccess(response.data.message)
            startTimer();
        } catch (error) {
            toast.error("User not found please register first");
        } finally {
            setLoading(false);
        }
    }
    const startTimer = () => {
        setTimer(60);
        setShowOtpField(true);
    };
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowOtpField(false);
                    toast.warn("OTP expired! Please generate again.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);
    const formatTime = (sec) =>
        `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
            sec % 60
        ).padStart(2, "0")}`;

    const handelUserRegister = async (e) => {
        e.preventDefault();
        // const { token, error } = await generateJwtToken();
        // if (error) {
        //     toast.error("JWT Failed: " + error);
        //     return;
        // }
        if (validateForm()) {
            try {
                setLoading(true);
                const response = await axiosInstance.post("/auth/login", {
                    emailId: userInputField.email,
                    otp: userInputField.otp,
                });
                if (response.status === 200) {
                    toast.success("Login successfull.")
                    setUserInputField({
                        email: "",
                        otp: "",
                    });
                    setShowOtpField(false)
                    localStorage.setItem("userId", response.data.data.userId);
                    navigate('/')
                }
            } catch (error) {
                console.error("Error registering user:", error);
                toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <div className="auth-container" id='auth-container-log'>
            <div className="auth-box" id='auth-box-log'>

                <div className="auth-left" id='auth-left-log'>
                    <div className="illustration" id='illustration-log'>
                        <img src={vitLogoWhite} alt="vit-logo" id='vit-logo-log'/>
                    </div>
                </div>
                <div className="auth-right" id='auth-right-log'>
                    <div className="form-container" id='form-container-log'>
                        <div className="logo" id='logo-log'>
                            <h2 id='vit-title-log'>VIT Chennai</h2>
                            <p id='onboarding-login-log'>Onboarding Login</p>
                            <div className="loading" id='loading-log'>
                                {loading && <LinearProgress />}
                            </div>
                        </div>
                        <form onSubmit={handelUserRegister} id='handle-user-register-log'>
                            <TextField
                                type="email"
                                error={!!errorsInput.email}
                                helperText={errorsInput.email}
                                id="input-email-log"
                                label="Enter Your Email"
                                variant="outlined"
                                name='email'
                                value={userInputField.email}
                                onChange={handelUser}
                            />
                            <div className="generate-otp" id='generate-otp-log'>
                                {showOtpField ? (
                                    <p style={{ textAlign: "right", color: "indianred" }} id='otp-expire-timer-log'>
                                        OTP expires in: {formatTime(timer)}
                                    </p>
                                ) : <p></p>}
                                {userInputField.email.trim() && <CustomeButton size="small" onClick={handleGenerateOtp} id='genrate-otp-log'>Generate OTP</CustomeButton>}
                            </div>
                            <TextField
                                type="text"
                                id=" input-otp-log"
                                label="Enter Your OTP"
                                variant="outlined"
                                name='otp'
                                value={userInputField.otp}
                                onChange={handelUser}
                            />
                            <CustomeButton type='submit' variant="contained" id='login-btn-log'>LOGIN</CustomeButton>
                            <p className="login-link" id='login-link-log'>
                                Don't have an account? <a href="/register" id='register-href-log'>Register</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login