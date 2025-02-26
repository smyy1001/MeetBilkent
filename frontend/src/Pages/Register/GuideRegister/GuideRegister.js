import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProgressBar } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import './GuideRegister.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Axios from '../../../Axios';
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import { InputAdornment, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Schedule from '../../../Components/Schedule/Schedule';

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


function GuideRegister() {

    const [step, setStep] = useState(1);
    const [guide, setGuide] = useState({ "name": '', "iban_no": "", "department": "", "password": '', "phone": '', "username": '', "notes": '', "emergency_contact_name": '', "emergency_contact_phone": '', "isactive": false });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [verify, setVerify] = useState(false);
    const [freeTime, setFreeTime] = useState({});

    const handleScheduleChange = (formattedSchedule) => {
        setFreeTime(formattedSchedule);
        console.log("SCHEDULAER: ", formattedSchedule);
        setGuide({ ...guide, "free_time": formattedSchedule });
    };

    const finalCodeRef = useRef(
        Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    );

    const finalCode = finalCodeRef.current;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleNextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const validateEmail = (email) => {
        const parts = email.split('@');
        if (parts.length !== 2) {
            message.error("E-posta '@ug.bilkent.edu.tr' veya '@bilkent.edu.tr' ile bitmelidir!");
            return false;
        }

        // Check if it ends with the allowed domains
        if (!email.endsWith('@ug.bilkent.edu.tr') && !email.endsWith('@bilkent.edu.tr')) {
            message.error("E-posta '@ug.bilkent.edu.tr' veya '@bilkent.edu.tr' ile bitmelidir!");
            return false;
        }

        return true;
    };

    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
        else {
            navigate('/register');
        }
    };

    const validatePhone = (phone) => {
        // Match numbers with optional "+" and country codes, dashes, spaces, and parentheses
        const phoneRegex = /^\+?[0-9\s()-]{7,15}$/;

        if (!phoneRegex.test(phone)) {
            message.error('Geçerli bir telefon numarası giriniz! (+, rakamlar, boşluk, parantez ve tire kabul edilir)');
            return false;
        }

        // Additional checks for length
        const numericPhone = phone.replace(/[^\d]/g, ""); // Remove non-numeric characters
        if (numericPhone.length < 7 || numericPhone.length > 15) {
            message.error('Telefon numarası 7 ile 15 hane arasında olmalıdır!');
            return false;
        }

        return true;
    };


    const validateIBAN = (iban) => {
        iban = iban.replace(/\s+/g, "").toUpperCase();

        if (iban.length !== 26) {
            message.error("Geçerli bir IBAN giriniz!")
            return false;
        }

        if (!iban.startsWith("TR")) {
            message.error("IBAN TR ile başlamalıdır!")
            return false;
        }

        return true;
    };


    const onFinish = async (username) => {
        if (validateEmail(username)) {
            Axios.post(`/api/users/confirmation2/${username}?code=${finalCode}`)
                .then((response) => {
                    console.log(response);
                    message.success('Kod mailinize gönderildi!');
                    setVerify(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const onFinish2 = async () => {
        if (finalCode === code) {
            message.success("Doğrulama başarılı! Şimdi kayıt olabilirsiniz.")
            setVerify(false);
            setStep(step + 1);
        }
        else {
            message.error("Güvenlik kodu yanlış! Lütfen mailinizi tekrar kontrol ediniz!")
        };
    };


    const handleSave = async () => {
        if (step < 4) {
            if (step === 2) {
                if (validateNewPassword(guide.password) && validatePhone(guide.phone) && validateIBAN(guide.iban_no) && guide.name !== '' && guide.department !== '') {
                    setStep(step + 1);
                }
                if (guide.name === '' || guide.department === '') {
                    message.error("Zorunlu alanları doldurunuz!");
                }
            }
            else {
                setStep(step + 1);
            }
        }
        else {
            if (guide.username !== '' && guide.password !== '' && guide.name !== '' && guide.phone !== '' && guide.department !== '' && guide.iban_no !== '') {
                try {
                    const user = { "username": guide.username, "password": guide.password };
                    const response2 = await Axios.post('/api/users/add', user);
                    const today = new Date().toISOString().split("T")[0]; // Formats to 'YYYY-MM-DD'
                    const newGuide = { ...guide, "user_id": response2.data.id, "start_date": today, "isActive": true };
                    const response = await Axios.post('/api/guides/add', newGuide);
                    // console.log(response);
                    // console.log(response2);
                    clearForm();
                    message.success('Rehber başarıyla kaydedildi!');
                    navigate('/login');
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.detail) {
                        message.error(error.response.data.detail);
                    } else {
                        message.error("Rehber kaydedilemedi");
                    }
                }
            }
            else {
                message.error('Lütfen tüm alanları doldurun!');
            }
        }
    };

    // check if password is valid
    const validateNewPassword = (password) => {
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




    const progressPercentage = ((step - 1) / 4) * 100;

    const clearForm = () => {
        setGuide({
            "name": '', "password": '', "phone": '', "username": '', "notes": '',
            "emergency_contact_name": '', "emergency_contact_phone": '', "isactive": false
        });
    }

    return (
        <div className='guide-register-page-outer-container'>
            <div className='guide-register-div1'>
                <ProgressBar className='guide-register-progress-bar' now={progressPercentage} label={`${Math.round(progressPercentage)}%`} />
            </div>
            <div className='guide-register-div2'>
                {step === 1 ? (
                    <div>
                        <span className='guide-register-header'>Merhaba!</span>
                    </div>
                ) : (step === 2 ? (
                    <div>
                        <span className='guide-register-header'>Aramıza Hoşgeldin!</span>
                    </div>
                ) : (step === 3 ? (
                    <div>
                        <span className='guide-register-header'>Son Birkaç Detay!</span>
                    </div>
                ) : (
                    <span className='guide-register-header'>Ne zaman müsaitsin?</span>
                )
                ))}
            </div>
            <div className='guide-register-div3'>
                {step === 1 ? (
                    <div>
                        <span className='guide-register-description'>E-mail adresinizi onaylamak için gelen kutusunda ya da junk’daki linke tıklayabilirsin. </span>
                        <span className='guide-register-description'> Unutma, mail adresin aynı zamanda kullanıcı adın!</span>
                    </div>
                ) : (step === 2 ? (
                    <div>
                        <span className='guide-register-description'>Şifre en az 8 haneli olmalıdır. Minimum 1 büyük harf ve 1 sayı kullanmaya da dikkat et!</span>
                    </div>
                ) : (step === 3 ? (
                    <div>
                        <span className='guide-register-description'>Koordinatörüne bırakmak istediğin bir mesaj varsa ekleyebilirsin!</span>

                    </div>
                ) : (
                    <div>
                        <span className='guide-register-description'>Ders programını ve düzenli katıldığın etkinliklerini düşün lütfen.</span>
                    </div>
                )
                ))}
            </div>
            <div className='guide-register-div4'>
                {step === 1 ? (
                    <div className='guide-register-form-container'>

                        <CustomTextField
                            autoComplete="off"
                            required
                            label="Bilkent Mail Adresin"
                            value={guide.username}
                            fullWidth
                            onChange={(e) => setGuide({ ...guide, "username": e.target.value })}
                        />

                        {verify &&
                            <CustomTextField
                                autoComplete="off"
                                required
                                label="Doğrulama Kodu"
                                value={code}
                                fullWidth
                                onChange={(e) => setCode(e.target.value)}
                            />
                        }

                    </div>
                ) : (step === 2 ? (
                    <div>
                        <div className='guide-register-form-container'>
                            <CustomTextField
                                autoComplete="off"
                                required
                                label="Şifre"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                value={guide.password}
                                onChange={(e) => setGuide({ ...guide, "password": e.target.value })}
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
                                required
                                label="Adın Soyadın"
                                value={guide.name}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "name": e.target.value })}
                            />

                            <CustomTextField
                                autoComplete="off"
                                required
                                label="Telefon Numaran"
                                value={guide.phone}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "phone": e.target.value })}
                            />

                            <CustomTextField
                                autoComplete="off"
                                required
                                label="Bölümün"
                                value={guide.department}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "department": e.target.value })}
                            />

                            <CustomTextField
                                autoComplete="off"
                                required
                                placeholder="TR..."
                                label="IBAN"
                                value={guide.iban_no}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "iban_no": e.target.value })}
                            />
                        </div>
                    </div>
                ) : (step === 3 ? (
                    <div>
                        <div className='guide-register-form-container'>
                            <CustomTextField
                                autoComplete="off"
                                label="Acil Durum Kişisi İsmi"
                                value={guide.emergency_contact_name}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "emergency_contact_name": e.target.value })}
                            />

                            <CustomTextField
                                autoComplete="off"
                                label="Acil Durum Kişisi İletişim"
                                value={guide.emergency_contact_phone}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "emergency_contact_phone": e.target.value })}
                            />

                            <CustomTextField
                                autoComplete="off"
                                label="Eklemek istediğin bir şey var mı?"
                                multiline
                                rows={3}
                                value={guide.notes}
                                fullWidth
                                onChange={(e) => setGuide({ ...guide, "notes": e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='guide-register-form-container' style={{ height: '650px' }}>
                            <Schedule onChange={handleScheduleChange} />
                            {/* <pre>{JSON.stringify(freeTime, null, 2)}</pre> */}
                        </div>
                    </div>
                )
                ))}
            </div>
            <div className='guide-register-div5'>

                {step !== 0 && (
                    <CustomButton className="guide-register-button" onClick={handlePreviousStep} disabled={step === 0}>
                        Geri
                    </CustomButton>
                )}
                {step !== 4 ? (
                    (step === 1 && !verify) ? (
                        <CustomButton className="guide-register-button" style={{ width: '300px' }} onClick={() => onFinish(guide.username)} disabled={step === 4}>
                            Doğrulama Kodu Gönder
                        </CustomButton>
                    ) : ((step === 1 && verify ? (
                        <CustomButton className="guide-register-button" onClick={onFinish2} disabled={step === 4}>
                            Doğrula
                        </CustomButton>
                    ) : (
                        <CustomButton className="guide-register-button" onClick={handleSave} disabled={step === 4}>
                            İleri
                        </CustomButton>
                    ))
                    )

                ) : (
                    <CustomButton className="guide-register-button" onClick={handleSave}>
                        Kaydet
                    </CustomButton>
                )}
            </div>
        </div>
    );
}

export default GuideRegister;