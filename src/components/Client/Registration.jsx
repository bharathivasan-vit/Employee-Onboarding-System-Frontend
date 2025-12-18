import React, { useEffect, useState } from 'react'
import '../../assets/auth.css'
import vitLogoWhite from "../../assets/vit-logo-white.png";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../api/axiosInstance';
import UseAlert from '../CustomeHooks/UseAlert';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LinearProgress from '@mui/material/LinearProgress';

function Registration() {
    const navigate = useNavigate()
    const RegisterButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#2c476d"),
        textTransform: 'none',
        backgroundColor: "#2c476d",
        '&:hover': {
            backgroundColor: "#2c476d",
        },
    }));
    const { showButtonAlert } = UseAlert();
    const [loading, setLoading] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [timer, setTimer] = useState(0);
    const [roles, setRoles] = useState([]);
    const [errorsInput, setErrorsInput] = useState({});
    const [userInputField, setUserInputField] = useState({
        userName: '',
        phone: '',
        role: '',
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
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get("/auth/getAllRoleList");
                setRoles(response.data.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);
    const validateForm = () => {
        const newErrors = {};
        if (!userInputField.userName.trim()) {
            newErrors.userName = "Name is required";
        }
        if (!userInputField.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(userInputField.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        if (!userInputField.role) {
            newErrors.role = "Please select a role";
        }
        if (!userInputField.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userInputField.email)) {
            newErrors.email = "Invalid email address";
        }
        setErrorsInput(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleGenerateOtp = async () => {
        if (!validateForm()) {
            toast.error("Please fill all fields correctly before generating OTP.")
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post("/auth/sendOtp/register", {
                emailId: userInputField.email,
                roleId: userInputField.role,
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
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
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
        `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

    const handelUserRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                const response = await axiosInstance.post("/auth/register", {
                    userName: userInputField.userName,
                    phoneNumber: userInputField.phone,
                    emailId: userInputField.email,
                    roleId: userInputField.role,
                    otp: userInputField.otp,
                });

                if (response.status === 200) {
                    toast.success(response.data.message)
                    setUserInputField({
                        userName: "",
                        phone: "",
                        role: "",
                        email: "",
                        otp: "",
                    });
                    setShowOtpField(false)
                    navigate('/login')
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
        <div className="auth-container" id='auth-container-reg'>
            <div className="auth-box" id='auth-box-reg'>
                <div className="auth-left" id='auth-left-reg'>
                    <div className="illustration" id='illustration-reg'>
                        <img src={vitLogoWhite} alt="vit-logo" id='vit-logo-reg' />
                    </div>
                </div>
                <div className="auth-right" id='auth-right-reg'>
                    <div className="form-container" id='form-container-reg'>
                        <div className="logo" id='logo-reg'>
                            <h2 id='vit-chennai-title-reg'>VIT Chennai</h2>
                            <p id='onboarding-registration-reg'>Onboarding Registration</p>
                            <div className="loading" id='auth-right-loading-reg'>
                                {loading && <LinearProgress />}
                            </div>
                        </div>
                        <form onSubmit={handelUserRegister} id='handle-user-register-form-reg'>
                            <TextField
                                type="text"
                                error={!!errorsInput.userName}
                                helperText={errorsInput.userName}
                                id="input-userName-reg"
                                label="Enter Your Name"
                                variant="outlined"
                                name='userName'
                                value={userInputField.userName}
                                onChange={handelUser}
                            />
                            <TextField
                                error={!!errorsInput.phone}
                                helperText={errorsInput.phone}
                                id="input-phone-reg"
                                label="Enter Your Phone Number"
                                variant="outlined"
                                name='phone'
                                value={userInputField.phone}
                                onChange={handelUser}
                            />
                            <Autocomplete
                                disablePortal
                                options={roles}
                                getOptionLabel={(option) => option.rolename || ""}
                                id='autocomplete-role-reg'
                                value={roles.find((data) => data.roleid === userInputField.role) || null}
                                onChange={(event, newValue) =>
                                    setUserInputField((prev) => ({
                                        ...prev,
                                        role: newValue ? newValue.roleid : "",
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params}
                                        label="Select Role"
                                        id='input-role-reg'
                                        error={!!errorsInput.role}
                                        helperText={errorsInput.role}
                                        variant="outlined" />
                                )}
                            />
                            <TextField
                                type="email"
                                error={!!errorsInput.email}
                                helperText={errorsInput.email}
                                id='input-email-reg'
                                label="Enter Your Email"
                                variant="outlined"
                                name='email'
                                value={userInputField.email}
                                onChange={handelUser}
                            />
                            <div className="generate-otp" id='generate-otp-reg'>
                                {showOtpField ? (
                                    <p style={{ textAlign: "right", color: "indianred" }} id='otp-expire-timer-reg'>
                                        OTP expires in: {formatTime(timer)}
                                    </p>
                                ) : <p></p>}
                                {userInputField.email.trim() && <RegisterButton size="small" id='generate-otp-btn-reg' onClick={handleGenerateOtp}>Generate OTP</RegisterButton>}
                            </div>
                            <TextField
                                type="text"
                                id="input-otp-reg"
                                label="Enter Your OTP"
                                variant="outlined"
                                name='otp'
                                value={userInputField.otp}
                                onChange={handelUser}
                            />
                            <RegisterButton type='submit' variant="contained" id='register-btn-reg'>REGISTER </RegisterButton>
                            <p className="login-link" id='login-link-reg'>
                                Already have an account? <a href="/login" id='login-href-reg'>Login in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration