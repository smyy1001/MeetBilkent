import React, { useEffect, useState } from "react";
import Axios from '../../Axios';
import { message } from 'antd';
import { styled } from '@mui/material/styles';
import { TextField, Button, MenuItem, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import onayImage from '../../assests/onay.png';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PhoneIcon from '@mui/icons-material/Phone';
import "./Applications.css";
import dayjs from 'dayjs';

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


export default function Applications() {
  const [formType, setFormType] = useState(null); // "fair" or "tour"
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const user = localStorage.getItem("user");
  const [fair, setFair] = useState({
    high_school_name: "",
    city: "",
    teacher_name: "",
    teacher_phone_number: "",
    form_sent_date: "",
    student_count: "",
    notes: "",
  });


  const disableDates = (date) => {
    // Disable all past dates and the next 14 days
    const today = dayjs();
    const fourteenDaysLater = today.add(14, 'day');

    return date.isBefore(today, 'day') || date.isBefore(fourteenDaysLater, 'day');
  };

  const [tour, setTour] = useState({
    high_school_name: "",
    city: "",
    student_count: "",
    teacher_name: "",
    teacher_phone_number: "",
    salon: "",
    form_sent_date: "", //
    notes: "",
  });

  const hours = [
    { value: '09:00', label: '09:00' },
    { value: '11:00', label: '11:00' },
    { value: '13:30', label: '13:30' },
    { value: '16:00', label: '16:00' },
  ];
  const [fair_date, setFairDate] = useState("");
  const [fair_hour, setFairHour] = useState("09.00");

  const [tour_date, setTourDate] = useState("");
  const [tour_hour, setTourHour] = useState("09.00");

  // Handles the selection of form type
  const handleFormTypeChange = (type) => {

    setFormType(type);
  };

  // Handle changes in the "fair" fields
  const handleFairChange = (e) => {
    const { name, value } = e.target;
    setFair((prevFair) => {
      return {
        ...prevFair,
        [name]: value,
      };
    });
  };

  // Handle changes in the "tour" fields
  const handleTourChange = (e) => {
    const { name, value } = e.target;
    setTour((prevTour) => {
      return {
        ...prevTour,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("Raw user from localStorage:", user);

        if (user && Object.keys(user).length !== 0) {
          console.log("user", user)
          const parsedUser = JSON.parse(user);
          console.log(typeof parsedUser);
          console.log("USER_ID:", parsedUser.id);
          const response = await Axios.get(`/api/schools/show/${parsedUser.id}`);
          console.log("response.data:", response.data);

          const high_school_name = response.data.school_name;
          const city = response.data.city

          setFair((prevState) => ({
            ...prevState,
            high_school_name: high_school_name,
            city: city,
          }));

          setTour((prevState) => ({
            ...prevState,
            high_school_name: high_school_name,
            city: city
          }));

        } else {
          console.log("Not logged in | useEffect");
          user = null;
        }
      } catch (e) {
        console.error("Error Message:", e.message);
      }
    };

    getUser();
  }, []); // Dependency array remains empty


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("tour:", tour)
    let selectedDate = formType === "fair" ? (`${fair_date.format('YYYY-MM-DD')}T${fair_hour}:00`) : (`${tour_date.format('YYYY-MM-DD')}T${tour_hour}:00`)


    console.log(selectedDate)
    const selectedDateObj = new Date(selectedDate);
    console.log(selectedDateObj)
    const currentDate = new Date();
    // Calculate the difference in days between the current date and selected date
    const diffTime = selectedDateObj - currentDate;
    const diffDays = diffTime / (1000 * 3600 * 24); // Convert ms to days



    console.log("diffDays:", diffDays)
    const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " "); // Convert to 'YYYY-MM-DD HH:MM:SS'
    console.log("form_sent_date:", formattedDate)

    const parsedUser = JSON.parse(user);
    const user_id = parsedUser.id;
    let submissionData;
    if (formType === "fair") {
      submissionData = { ...fair, form_sent_date: formattedDate, date: selectedDate, school_id: user_id };
    } else if (formType === "tour") {
      submissionData = { ...tour, form_sent_date: formattedDate, date: selectedDate, school_id: user_id };
    }
    console.log("formattedDate:", formattedDate)
    console.log("user.id:", user_id);
    /* 
    
        setFair((prevState) => ({
          ...prevState,
          form_sent_date : formattedDate
        }))
    
        setTour((prevState) => ({
          ...prevState,
          form_sent_date : formattedDate
        }))
         */
    // Check if the selected date is at least 2 weeks away
    if (diffDays < 14) {
      message.error("Başvuru tarihi, bugünden en az 2 hafta sonrası olmalıdır.");
      return; // Prevent form submission
    }

    // Check if the student count exceeds 1000 for the tour
    if (formType === "tour" && tour.student_count <= 0 && tour.student_count > 1000) {
      message.error("Öğrenci sayısı 1 ile 1000 arası olamlıdır.");
      return; // Prevent form submission
    }

    if (formType === "tour" && tour.teacher_phone_number) {
      const phoneNumber = tour.teacher_phone_number;

      // Check if it starts with '0' and is 11 digits long
      const isValid = /^0\d{10}$/.test(phoneNumber);

      if (!isValid) {
        message.error("Geçersiz telefon numarası. Telefon numaranız 0xxx xxx xx xx şekilden olmalıdır");
        return;
      }
    }
    try {
      let response;

      if (formType === "fair") {
        console.log("Submitting Fair Form:", submissionData);
        response = await Axios.post("/api/fairs/send_fair_request/", submissionData);
      } else if (formType === "tour") {
        console.log("Submitting Tour Form:", submissionData);
        response = await Axios.post("/api/tours/send_tour_request/", submissionData);
      }

      // If submission is successful
      console.log("Form submitted successfully:", response.data);
      setIsSubmitted(true);
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/home");
      }, 2000);

    } catch (error) {
      // Handle error properly
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };


  return (
    <Container className="application-container" style={{ "margin-top": "60px", "max-width": "90vw" }}>

      {isSubmitted &&
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",  // Takes up the full height of the viewport
          textAlign: "center"  // Center text horizontally }}>
        }}
        >
          {/* Image */}
          <img
            src={onayImage}
            alt="Success"
            style={{ width: "100px", height: "auto", display: "block", margin: "0 auto" }}
          />

          {/* Text */}
          <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
            🎉 Form başarıyla kaydedildi!
          </Typography>

          <p>Ana Sayfaya yönlendiriliyorsunuz 2s...</p>
        </div>
      }


      {!isSubmitted && (
        <div style={{ padding: "20px" }}>
          <h2>Başvuru türü seçiniz: </h2>
          <div style={{ marginBottom: "20px" }}>
            <div className="tours-tour-card-buttons2">
              <CustomButton className="tours-tour-card-button one"
                variant="contained"
                color="primary"
                onClick={() => handleFormTypeChange("fair")}
              >
                Fuar
              </CustomButton>
              <CustomButton className="tours-tour-card-button two"
                variant="contained"
                color="secondary"
                onClick={() => handleFormTypeChange("tour")}
                style={{ marginLeft: "10px" }}
              >
                Tur
              </CustomButton>
            </div>
          </div>
          {/* Render Fair Form */}
          {formType === "fair" && (
            <form onSubmit={handleSubmit}>
              <h3>Fuar Başvurusu</h3>

              <Typography variant="body1" style={{}}>
                Buradan bizlere okulunuzda sergilediğiniz fuarlar için davet gönderebilirsiniz.
              </Typography>

              <CustomTextField
                name="high_school_name"
                label="Lise Adı"
                value={fair.high_school_name}
                onChange={handleFairChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  readOnly: true, // Makes the field non-editable but not visually disabled
                }}
                disabled
              />
              <CustomTextField
                name="city"
                label="Şehir"
                value={fair.city}
                onChange={handleFairChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  readOnly: true, // Makes the field non-editable but not visually disabled
                }}
                disabled
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tarih"
                  value={fair_date}
                  onChange={(newValue) => setFairDate(newValue)}
                  shouldDisableDate={disableDates}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      margin="normal"
                      onClick={params.inputProps.onFocus} // Open picker on click
                    />
                  )}
                />
              </LocalizationProvider>

              <CustomTextField
                label="Saat"
                name="hour"
                placeholder="örn: 09.00"
                select
                value={fair_hour}
                onChange={(e) => { setFairHour(e.target.value) }}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              >

                {hours.map((hour) => (
                  <MenuItem key={hour.value} value={hour.value}>
                    {hour.label}
                  </MenuItem>
                ))}

              </CustomTextField>

              <CustomTextField
                name="teacher_name"
                label="Rehber Öğretmen Adı"
                value={fair.teacher_name}
                onChange={handleFairChange}
                fullWidth
                required
                margin="normal"
              />
              <CustomTextField
                name="teacher_phone_number"
                label="Rehber Öğretmen Telefon Numarası"
                placeholder="0 XXX XXX XX XX"
                value={fair.teacher_phone_number}
                onChange={handleFairChange}
                fullWidth
                required
                type="number"
                margin="normal"
              />
              <Typography variant="body1" style={{}}>
                Fuarınıza kaç kişi gelmemizi istediğinizi de belirtebilirsiniz.
              </Typography>

              <CustomTextField
                name="student_count"
                label="Davetli Sayısı"
                type="number"
                value={fair.student_count}
                onChange={handleFairChange}
                fullWidth
                margin="normal"
              />



              {/* <CustomTextField
            name="guide_count"
            label="Guide Count"
            type="number"
            value={fair.guide_count}
            onChange={handleFairChange}
            fullWidth
            required
            margin="normal"
          /> */}
              <CustomTextField
                name="notes"
                label="Notes (Opsiyonel)"
                value={fair.notes}
                onChange={handleFairChange}
                fullWidth
                multiline
                margin="normal"
                rows={3}
              />
              <CustomButton className="tours-tour-card-button two" type="submit" variant="contained">
                Başvur
              </CustomButton>
            </form>
          )}

          {/* Render Tour Form */}
          {formType === "tour" && (
            <form onSubmit={handleSubmit}>
              <h3>Tur Başvurusu</h3>

              <Typography variant="body1" style={{}}>
                Buradan Bilkent Üniversitesi Kampüsünde rehberlerimiz eşliğinde tanıtım turu için başvuru yapabilirsiniz.
              </Typography>

              <CustomTextField
                name="high_school_name"
                label="Lise Adı"
                value={tour.high_school_name}
                onChange={handleTourChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  readOnly: true, // Makes the field non-editable but not visually disabled
                }}
                disabled
              />
              <CustomTextField
                name="city"
                label="Şehir"
                value={tour.city}
                onChange={handleTourChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  readOnly: true, // Makes the field non-editable but not visually disabled
                }}
                disabled
              />
              {/* <CustomTextField
            label="Tarih"
            name="date"
            type="datetime-local"
            value={tour.date}
            onChange={handleTourChange}
            fullWidth
            required
            margin="normal"
          />
          */}
              {/* <CustomTextField
        label="Select Date"
        name="date"
        type="date"
        value={date}
        onChange={() => {setDate(date)}}
        fullWidth
        required
        InputLabelProps={{
          shrink: true,
        }}
      /> */}

              <Typography variant="body1" style={{}}>
                Tarih bugünden en az 2 hafta sonra olmalıdır.
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tarih"
                  value={tour_date}
                  onChange={(newValue) => setTourDate(newValue)}
                  shouldDisableDate={disableDates}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      margin="normal"
                      onClick={params.inputProps.onFocus} // Open picker on click
                    />
                  )}
                />
              </LocalizationProvider>

              <CustomTextField
                label="Saat"
                name="hour"
                placeholder="örn: 09.00"
                select
                value={tour_hour}
                onChange={(e) => { setTourHour(e.target.value) }}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {hours.map((hour) => (
                  <MenuItem key={hour.value} value={hour.value}>
                    {hour.label}
                  </MenuItem>
                ))}

              </CustomTextField>





              <CustomTextField
                name="student_count"
                label="Öğrenci Sayısı"
                type="number"
                value={tour.student_count}
                onChange={handleTourChange}
                fullWidth
                required
                margin="normal"
              />
              <CustomTextField
                name="teacher_name"
                label="Rehber Öğretmen Adı"
                value={tour.teacher_name}
                onChange={handleTourChange}
                fullWidth
                required
                margin="normal"
              />
              <CustomTextField
                name="teacher_phone_number"
                label="Rehber Öğretmen Telefon Numarası"
                value={tour.teacher_phone_number}
                onChange={handleTourChange}
                fullWidth
                required
                margin="normal"
              />


              <Typography variant="body1" style={{ marginTop: '8px' }}>
                Dilerseniz ziyaretiniz sırasında sizi amfilerimizde ağırlayabiliriz.
              </Typography>




              <CustomTextField
                name="salon"
                label="Amfi"
                value={tour.salon}
                onChange={handleTourChange}
                fullWidth
                margin="normal"
                select
                required
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <MenuItem value="yes">Olsun.</MenuItem>
                <MenuItem value="no">Olmasın.</MenuItem>
              </CustomTextField>

              <CustomTextField
                name="notes"
                label="Notes (Optional)"
                value={tour.notes}
                onChange={handleTourChange}
                fullWidth
                multiline
                margin="normal"
                rows={3}
              />
              <CustomButton className="tours-tour-card-button two" type="submit" variant="contained">
                Başvur
              </CustomButton>
            </form>
          )}
        </div>
      )}
    </Container>
  );
}