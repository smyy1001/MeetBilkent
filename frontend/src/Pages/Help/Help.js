import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Axios from '../../Axios';

const CustomTextField = styled(TextField)({
    "& .MuiInput-underline:after": {
        borderBottomColor: "black",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "black",
        },
        "&:hover fieldset": {
            borderColor: "black",
        },
        "&.Mui-focused fieldset": {
            borderColor: "black !important",
        },
        "& input:valid:focus + fieldset": {
            borderColor: "black !important",
        },
    },
    "& .MuiFilledInput-root": {
        "&:before": {
            borderBottomColor: "black",
        },
        "&:hover:before": {
            borderBottomColor: "black",
        },
        "&:after": {
            borderBottomColor: "black",
        },
        "&:hover fieldset": {
            borderColor: "black",
        },
        "&.Mui-focused fieldset": {
            borderColor: "black",
        },
    },
    "& label.Mui-focused": {
        color: "black",
    },
    "& label": {
        color: "black",
    },
    "& .MuiInputBase-root": {
        "&::selection": {
            backgroundColor: "rgba(255, 255, 255, 0.99)",
            color: "#241b19",
        },
        "& input": {
            caretColor: "black",
        },
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black !important",
    },
    "& .MuiInputBase-input::selection": {
        backgroundColor: "rgba(255, 255, 255, 0.99)",
        color: "#241b19",
    },
});


const CustomButton = styled(Button)({
    "&.MuiButton": {
        color: "black",
        borderColor: "black",
        "&:hover": {
            borderColor: "red",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        "&.Mui-focused": {
            borderColor: "black !important",
        },
        "&.Mui-disabled": {
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "rgba(255, 255, 255, 0.3)",
        },
    },
});


function Help() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [progress, setProgress] = useState(false);
    const [code, setCode] = useState("");
    const [id, setId] = useState(null);

    const finalCodeRef = useRef(
        Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    );

    const finalCode = finalCodeRef.current;

    const onFinish = async () => {
        Axios.get(`/api/users/show/${email}`)
            .then((response) => {
                setId(response.data.id);
                Axios.post(`/api/users/confirmation/${response.data.id}?code=${finalCode}`)
                    .then((response) => {
                        console.log(response);
                        message.success('Kod mailinize gönderildi!');
                        setProgress(true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onFinish2 = async () => {
        if (finalCode === code) {
            if (checkPasswords()) {
                if (validateNewPassword()) {
                    try {
                        const response = await Axios.post(`/api/users/change_password2/${id}?new_password=${password}`);
                        if (response.status === 200) {
                            message.success('Şifre güncellendi!');
                            setProgress(false);
                            setCode("");
                            
                            navigate('/login');
                        }
                    } catch (error) {
                        message.error('E-mail veya şifre hatalı!');
                    }
                }
            }
            else {
                message.error("Girilen Şifreler aynı değil!");
            }
        }
        else {
            message.error("Güvenlik kodu yanlış! Lütfen mailinizi tekrar kontrol ediniz!")
        };
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };


    // check if password3 and password4 are the same
    const checkPasswords = () => {
        if (password2 !== password) {
            message.error('Yeni şifreler eşleşmiyor!');
            return false;
        }
        return true;
    };

    // check if password is valid
    const validateNewPassword = () => {
        if ((password).length < 8) {
            message.error('Şifre en az 8 karakter olmalı!');
            return false;
        }
        if (!/\d/.test(password)) {
            message.error('Şifre en az bir tane sayı içermeli!');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            message.error('Şifre en az bir tane büyük harf içermeli!');
            return false;
        }
        return true;
    };

    return (
        <div className='login-page-outer-container'>

            <div className='register-and-login-containers'>

                {!progress ?
                    <div className='login-form-container' style={{ height: '350px' }}>

                        <div className='login-page-form-header'>
                            Meet<span className='bilkent-header-style'>Bilkent</span>
                        </div>
                        <div className='login-form' style={{ marginTop: '30px' }}>
                            <CustomTextField
                                autoComplete="off"
                                label="E-posta"
                                value={email}
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <CustomButton className="login-form-button" onClick={() => onFinish()}>
                                Doğrula
                            </CustomButton>
                        </div>
                    </div>
                    :
                    <div className='login-form-container' style={{ height: '600px' }}>

                        <div className='login-page-form-header'>
                            Meet<span className='bilkent-header-style'>Bilkent</span>
                        </div>

                        <div className='login-form' style={{ marginTop: '30px' }}>
                            <div className='login-page-footer-outer-cont'>
                                <hr style={{ color: 'black', backgroundColor: 'black', width: '170px', height: '0.1rem' }} />
                                Mailinize gönderilen kodu giriniz!
                                <hr style={{ color: 'black', backgroundColor: 'black', width: '170px', height: '0.1rem' }} />
                            </div>
                            <CustomTextField
                                autoComplete="off"
                                label="Kod"
                                fullWidth
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <br />
                            <div className='login-page-footer-outer-cont'>
                                <hr style={{ color: 'black', backgroundColor: 'black', width: '20px', height: '0.1rem' }} />
                                Şifre 8 haneden uzun olmalı, en az bir tane sayı ve büyük harf bulundurmalı!
                                <hr style={{ color: 'black', backgroundColor: 'black', width: '20px', height: '0.1rem' }} />
                            </div>
                            <CustomTextField
                                autoComplete="off"
                                label="Yeni Şifre"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <CustomTextField
                                autoComplete="off"
                                label="Yeni Şifre Tekrar"
                                fullWidth
                                type={showPassword2 ? 'text' : 'password'}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility2}
                                            >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <CustomButton className="login-form-button" onClick={() => onFinish2()}>
                                Şifreyi Güncelle
                            </CustomButton>

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Help;