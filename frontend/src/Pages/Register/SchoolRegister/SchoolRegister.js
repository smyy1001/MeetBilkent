import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ProgressBar } from "react-bootstrap";
import { TextField, Autocomplete } from "@mui/material";
import "./SchoolRegister.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Axios from "../../../Axios";
import { useNavigate } from "react-router-dom";
import { message, Select } from "antd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { InputAdornment, IconButton } from "@mui/material";

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

const SchoolRegister = ({ schoolsList, cities }) => {
  const [showToast, setShowToast] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [school, setSchool] = useState({
    school_name: "",
    password: "",
    email: "",
    city: "",
    username: "",
    user_role: "",
    user_phone: "",
    notes: [],
  }); // usestate -> inside paranthesis, we have the default value of the 'schoolName'  // use states must be called inside a react component or function
  const [step, setStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [code, setCode] = useState("");
  const [password_repeat, setPasswordRepeat] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [progress, setProgress] = useState(25);
  const navigate = useNavigate();
  const noteData = {
    content: notes,
  };

  const finalCodeRef = useRef(
    Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 10)
  );

  const finalCode = finalCodeRef.current;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const incStep = () => {
    setStep(step + 1);
    const prog_constant = 33;
    setProgress((prev) =>
      prev + prog_constant < 100 ? prev + prog_constant : 100
    );
  };
  const decStep = () => {
    setStep(step - 1);
  };

  const backtoRegisterPage = () => {
    navigate("/register");
  };

  const handleFirstStepClick = () => {
    if (school.school_name === "" || school.email === "") {
      // pop up -> please fill in the blank boxes
      message.error("Lütfen boş alanları doldurunuz.");
      // setShowToast(true);
    } else {
      incStep();
    }
  };
  const validateEmail = (email) => {
    if (!school.email.includes("@")) {
      message.error("Lütfen geçerli bir email giriniz.");
      // setShowToast(true);
      return { valid: false, message: "E-posta geçersiz." };
    }
    // Split the email by '@' to check for multiple '@'
    const parts = email.split("@");
    if (parts.length !== 2) {
      message.error("Lütfen geçerli bir email giriniz.");
      // setShowToast(true);
      return { valid: false, message: "E-posta en fazla bir '@' içermelidir!" };
    }
    // If all validations pass
    return { valid: true, message: "E-posta geçerli." };
  };

  const onFinish = async () => {
    console.log("onfinish called");
    if (validateEmail(school.email)) {
      Axios.post(`/api/users/confirmation2/${school.email}?code=${finalCode}`)
        .then((response) => {
          console.log(response);
          message.success("Kod mailinize gönderildi!");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log("onfinish stopped.");
    setIsEmailEntered(true);
    //setIsVerified(true);
  };

  const onFinish2 = async () => {
    if (finalCode === code) {
      message.success("Doğrulama başarılı! Şimdi kayıt olabilirsiniz.");
      setIsVerified(false);
      handleFirstStepClick();
    } else {
      message.error(
        "Güvenlik kodu yanlış! Lütfen mailinizi tekrar kontrol ediniz!"
      );
    }
  };

  const handleSecondStepClick = () => {
    //const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/; // Regex to ensure at least one uppercase letter and one digit
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

    if (
      school.password === "" ||
      password_repeat === "" ||
      school.user_phone === ""
    ) {
      message.error("Lütfen boş alanları doldurunuz.");
      // setShowToast(true);
    } else if (school.password.length < 8) {
      // pop up, password should be at least 8 characters long
      message.error("Güvenliğiniz için şifreniz en az 8 karakter olmalıdır.");
      // setShowToast(true);
    } else if (!passwordRegex.test(school.password)) {
      message.error(
        "Şifreniz en az bir büyük harf ve bir rakam içermelidir."
      );
      // setShowToast(true);
    } else if (school.password !== password_repeat) {
      // pop up, repeated password shoudl match the password entered.
      message.error("Şifreler aynı değil. Lütfen tekrar deneyiniz.");
      // setShowToast(true);
    } else if (
      !(school.user_phone[0] === "0") ||
      school.user_phone.length !== 11
    ) {
      message.error(
        "Lütfen geçerli bir telefon numarası giriniz. örnek: 0 555 555 55 55"
      );
      // setShowToast(true);
    } else {
      incStep();
    }
  };

  const onSave = async () => {
    console.log("onsave function");
    if (school.username === "" || school.city === "") {
      message.error("Lütfen boşluklu alanları doldurun.");
      // setShowToast(true);
    } else {
      console.log("onsave function | else");
      try {
        var users = { username: school.email, password: school.password };
        console.log("onsave function | else1");
        const response2 = await Axios.post("/api/users/add", users);
        console.log("onsave function | else2");
        const newSchool = { ...school, user_id: response2.data.id };
        console.log("onsave function | else3");
        console.log("school:", newSchool);
        const response1 = await Axios.post("/api/schools/add", newSchool);
        console.log("onsave function | else4");
        const school_id = response1.data.id;
        console.log("school_id", school_id);
        console.log("notes:", notes);
        const response_notes = await Axios.post(
          `/api/schools/${school_id}/add_note`,
          noteData
        );
        console.log("onsave function | else5");

        // console.log(response1.data);

        clearForm();

        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          message.error(error.response.data.detail);
        } else {
          message.error("Okul kaydedilemedi");
        }
      }
    }
  };

  const clearForm = () => {
    setSchool({
      school_name: "",
      password: "",
      email: "",
      city: "",
      username: "",
      user_role: "",
      user_phone: "",
      notes: [],
    });
  };

  // Auto-hide the modal after 10 seconds when it appears
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <CustomButton
        className=" geri-dön-btn"
        style={{
          position: "fixed",
          left: "10px",
          top: "80px",
          zIndex: "1050",
          color: "black",
        }}
        onClick={backtoRegisterPage}
      >
        {/* back arrow svg inside the button */}
        {/* <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 512 512">
                <g>
	                <g>
		                <g>
			<path d="M0,0v512h512V0H0z M469.333,469.333H42.667V42.667h426.667V469.333z"/>
			<path d="M110.931,243.242c-0.226,0.302-0.461,0.598-0.671,0.913c-0.204,0.304-0.38,0.62-0.566,0.932
				c-0.17,0.285-0.349,0.564-0.506,0.857c-0.17,0.318-0.315,0.646-0.468,0.971c-0.145,0.306-0.297,0.607-0.428,0.921
				c-0.13,0.315-0.236,0.637-0.35,0.957c-0.121,0.337-0.25,0.669-0.354,1.013c-0.097,0.32-0.168,0.646-0.249,0.969
				c-0.089,0.351-0.187,0.698-0.258,1.055c-0.074,0.375-0.118,0.753-0.173,1.13c-0.044,0.311-0.104,0.617-0.135,0.933
				c-0.138,1.4-0.138,2.811,0,4.211c0.031,0.315,0.09,0.621,0.135,0.933c0.054,0.377,0.098,0.756,0.173,1.13
				c0.071,0.358,0.169,0.704,0.258,1.055c0.081,0.324,0.152,0.649,0.249,0.969c0.104,0.344,0.233,0.677,0.354,1.013
				c0.115,0.32,0.22,0.642,0.35,0.957c0.13,0.314,0.283,0.615,0.428,0.921c0.153,0.325,0.297,0.653,0.468,0.971
				c0.157,0.293,0.336,0.572,0.506,0.857c0.186,0.312,0.363,0.628,0.566,0.932c0.211,0.315,0.445,0.611,0.671,0.913
				c0.191,0.255,0.368,0.516,0.571,0.764c0.439,0.535,0.903,1.05,1.392,1.54c0.007,0.008,0.014,0.016,0.021,0.023l85.333,85.333
				c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17l-48.915-48.915H384c11.782,0,21.333-9.551,21.333-21.333
				s-9.551-21.333-21.333-21.333H179.503l48.915-48.915c8.331-8.331,8.331-21.839,0-30.17s-21.839-8.331-30.17,0l-85.333,85.333
				c-0.008,0.008-0.014,0.016-0.021,0.023c-0.488,0.49-0.952,1.004-1.392,1.54C111.299,242.726,111.122,242.987,110.931,243.242z"/>
		                </g>
	                </g>
                </g>
                        </svg> */}
        <ArrowBackIcon style={{ marginRight: "5px" }} />
        Geri Dön
      </CustomButton>

      <div className="school-register-page-outer-container">
        {/* progress bar */}
        <div className="progress-container">
          {/* <ProgressBar
            now={progress} // 'progress' is a percentage value (0-100)
            className="school-progress-bar"
          >
            <p style={{ margin: 0 }}>{progress}%</p>
          </ProgressBar> */}

          <ProgressBar className='guide-register-progress-bar' now={progress} label={`${Math.round(progress)}%`} />
        </div>

        {/* Bootstrap-style Modal positioned at bottom-right */}
        {/* Toast Notification */}
        {showToast && (
          <div
            className="toast toast-bottom-right show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="mr-auto">Alert</strong>
              <button
                type="button"
                className="ml-2 mb-1 close"
                onClick={() => setShowToast(false)}
              >
                &times;
              </button>
            </div>
            <div className="toast-body">{modalMessage}</div>
          </div>
        )}

        {step === 1 ? (
          <div className="container okul-adi">
            <h1>Okulunuzun Adı ve E-Postanız</h1>

            <p>
              Eğer okulunuz sistemimizde zaten kayıtlı ise okulunuzdan başka
              biri sisteme kayıt olmuş olabilir. Okulunuzun kaydıyla ilgili bir
              sıkıntı olduğunu düşünüyorsanız{" "}
              <span color="blue">edip.aras@ug.bilkent.edu.tr</span> email
              adresiyle iletişime geçebilirsiniz
            </p>

            {/* <CustomTextField
                            autoComplete="off"
                            required
                            label="Okul Adı"
                            variant="outlined"
                            placeholder="örn: Kabataş Erkek Lisesi"
                            value={school.school_name}
                            fullWidth
                            onChange={(e) => { setSchool({ ...school, "school_name": e.target.value }) }}
                        > </CustomTextField> */}

            <Autocomplete
              options={schoolsList}
              fullWidth
              required
              value={school.school_name}
              onChange={(event, newValue) => {
                setSchool({ ...school, school_name: newValue || "" });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Okul Adı"
                  placeholder="örn: İstanbul Kabataş Erkek Lisesi"
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            <CustomTextField
              className="textfield-email"
              required
              label="E-Posta Giriniz"
              placeholder="örn: edip.aras@ug.bilkent.edu.tr"
              style={{ display: "block" }}
              fullWidth
              value={school.email}
              onChange={(e) => {
                setSchool({ ...school, email: e.target.value });
              }}
            >
              {" "}
            </CustomTextField>

            {isEmailEntered && (
              <CustomTextField
                className="textfield-code"
                required
                label="Onay Kodunu Giriniz"
                placeholder="örn: a2sdf3sFcd7"
                style={{ display: "block" }}
                fullWidth
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              >
                {" "}
              </CustomTextField>
            )}

            <div className="buttons">
              {!isEmailEntered && (
                <CustomButton
                  className="btn yön-btn ileri-btn"
                  style={{ color: "white", marginTop: "10px" }}
                  onClick={onFinish}
                >
                  Kod Gönder
                </CustomButton>
              )}

              {isEmailEntered && (
                <a
                  style={{
                    color: "#007BFF", // Blue text color for visibility on white background
                    marginTop: "10px",
                    cursor: "pointer",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "500", // Slightly lighter font weight for a modern look
                    textAlign: "center",
                    textDecoration: "none", // No underline
                    display: "inline-block",
                    backgroundColor: "transparent", // Transparent background to blend with the white background
                    border: "2px solid #007BFF", // Border to outline the anchor and match the text color
                    transition: "all 0.3s ease", // Smooth transition for hover effects
                  }}
                  onClick={() => {
                    onFinish(school.email);
                    setCode("");
                  }}
                >
                  Tekrar Kod Gönder
                </a>
              )}

              {isEmailEntered && (
                <CustomButton
                  className="btn yön-btn ileri-btn"
                  style={{ color: "white", marginTop: "10px" }}
                  onClick={onFinish2}
                >
                  Onayla
                </CustomButton>
              )}
            </div>
          </div>
        ) : /**
                     * UI Library Handling: In libraries like Material-UI, the fullWidth prop is specifically designed to make the component occupy the full width of its container. When you set fullWidth, the library often applies specific CSS rules and layout adjustments to ensure that the component behaves as expected.
    
    Style Inheritance and Specificity: When you use style={{ width: "100%" }}, it may not always behave as expected, especially if the component has internal styles or if its parent container has specific width constraints. In contrast, fullWidth usually overrides these constraints, ensuring the element takes up all available width in its container
                     */
        step === 2 ? (
          //  JSX requires conditional expressions to return a single element

          <div className="step">
            {/** step 2 */}

            <h1>İletişim Bilgileri</h1>
            <p>
              Şifrenizi ve ulaşabileceğimiz bir telefon numarası girebilir
              misiniz?
            </p>

            <div className="textfield">
              <CustomTextField
                className="textfield-user-phone"
                required
                label="Cep Telefonu Giriniz"
                placeholder="0 XXX XXX XX XX"
                style={{ display: "block" }}
                fullWidth
                value={school.user_phone}
                onChange={(e) => {
                  setSchool({ ...school, user_phone: e.target.value });
                }}
              >
                {" "}
              </CustomTextField>

              <CustomTextField
                type={passwordVisible ? "text" : "password"}
                autoComplete="off"
                required
                label="Şifre"
                variant="outlined"
                value={school.password}
                fullWidth
                onChange={(e) => {
                  setSchool({ ...school, password: e.target.value });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                {" "}
              </CustomTextField>

              <CustomTextField
                type={passwordVisible ? "text" : "password"}
                autoComplete="off"
                required
                label="Şifre Tekrar"
                variant="outlined"
                value={password_repeat}
                fullWidth
                onChange={(e) => {
                  setPasswordRepeat(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                {" "}
              </CustomTextField>
            </div>
            <div className="buttons">
              <CustomButton
                className="btn step-2 geri-btn"
                onClick={decStep}
                style={{ display: "inline" }}
              >
                Geri
              </CustomButton>

              <CustomButton
                className="btn step-2 ileri-btn"
                onClick={handleSecondStepClick}
                style={{ display: "inline" }}
              >
                İleri
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="step">
            {/** step 3 */}

            <h1>Sizinle İlgili Birkaç Detay</h1>
            <p>Kişisel bilgilerinizi girebilir misiniz?</p>

            <div className="textfield">
              <CustomTextField
                className="textfield-user-name"
                required
                label="İsim - Soyisim Giriniz"
                placeholder="örn: Ömer Edip Aras"
                style={{ display: "block" }}
                fullWidth
                value={school.username}
                onChange={(e) => {
                  setSchool({ ...school, username: e.target.value });
                }}
              >
                {" "}
              </CustomTextField>

              {/* <CustomTextField
                                className="textfield-city"
                                required
                                label="Şehir"
                                placeholder="örn: Gaziantep"
                                style={{ display: "block" }}
                                fullWidth
                                value={school.city}
                                onChange={(e) => { setSchool({ ...school, "city": e.target.value }) }}
                                    > </CustomTextField> */}

              <Autocomplete
                options={cities}
                fullWidth
                required
                value={school.city}
                onChange={(event, newValue) => {
                  setSchool({ ...school, city: newValue || "" });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Şehir"
                    placeholder="örn: Ankara"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <CustomTextField
                className="textfield-notes"
                fullWidth
                label="Notlarınız"
                placeholder="Notlarınızı buraya yazabilirsiniz.."
                multiline
                rows={3}
                height="100px"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              >
                {" "}
              </CustomTextField>
            </div>

            <div className="buttons">
              <CustomButton
                className="btn step-2 geri-btn"
                onClick={decStep}
                style={{ display: "inline" }}
              >
                Geri
              </CustomButton>

              <CustomButton
                className="btn step-2 ileri-btn"
                onClick={onSave}
                style={{ display: "inline" }}
              >
                Kaydet
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SchoolRegister;
