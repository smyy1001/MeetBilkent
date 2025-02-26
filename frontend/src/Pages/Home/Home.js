import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import FestivalIcon from "@mui/icons-material/Festival";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import Groups2Icon from "@mui/icons-material/Groups2";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Modal, Input, message } from "antd"; // Added for modal functionality
import Axios from "../../Axios";

function Home({ role }) {
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [email, setEmail] = useState(""); // Email input state

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => {
    setEmail("");
    setModalVisible(false);
  };

  const handleSubmitEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      message.error("Lütfen geçerli bir e-posta adresi girin!");
      return;
    }
  
    try {
      // Backend'e POST isteği gönder
      const response = await Axios.post("/api/tours/send-email", email, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
  
      // Backend'den başarı mesajı alındıysa göster
      if (response.data && response.data.message) {
        message.success(response.data.message);
      } else {
        message.success("E-posta başarıyla gönderildi!");
      }
  
      // Modal'ı kapat ve e-posta alanını temizle
      handleCloseModal();
    } catch (error) {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      // Hata durumunda mesaj göster
      if (error.response && error.response.data) {
        message.error(error.response.data.detail || "E-posta gönderilirken bir hata oluştu.");
      } else {
        message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };
  

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
          padding: "10px",
          zIndex: 10,
          left: "10px",
        }}
        onClick={onClick}
      >
        <ArrowLeftIcon style={{ color: "white", display: "none" }} />
      </div>
    );
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
          padding: "10px",
          zIndex: 10,
          right: "30px",
        }}
        onClick={onClick}
      >
        <ArrowRightIcon style={{ color: "white", display: "none" }} />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

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

  return (
    <div className="home-page-outer-container">
      <Slider {...sliderSettings}>
        <div>
          <div className="slider">
            <img className="homeSliderPhotos" src="homeSlide1.png" style={{ marginTop: "300px" }} />

          </div>
        </div>
        <div>
          <div className="slider">
            <img className="homeSliderPhotos" src="homeSlide2.png" style={{ marginTop: "300px" }} />
          </div>
        </div>
        <div>
          <div className="slider">
            <img className="homeSliderPhotos" src="homeSlide3.png" style={{ marginTop: "300px" }}/>
          </div>
        </div>
        <div>
          <div className="slider">
            <img className="homeSliderPhotos" src="homeSlide4.png" style={{ marginTop: "300px" }}/>
          </div>
        </div>
      </Slider>
      <div className="home-big-container">
        <div className="home-card">
          <Groups2Icon className="home-card-icon" />
          <div className="home-card-content">
            <div>Okulunuzu Bilkentle</div>
            <div>Tanıştırmak İçin</div>
          </div>
          {!role ? (
            <CustomButton
              style={{ color: "whitesmoke" }}
              className="home-card-button"
              onClick={() => navigate("/register")}
            >
              Kaydol
            </CustomButton>
          ) : (
            <CustomButton
              style={{ color: "whitesmoke" }}
              className="home-card-button"
              onClick={() => navigate("/apply")}
            >
              Başvur
            </CustomButton>
          )}
        </div>
        <div className="home-card">
          <FestivalIcon className="home-card-icon" />
          <div className="home-card-content">
            <div>Bilkenti Fuarınıza</div>
            <div>Davet Etmek için</div>
          </div>
          {!role ? (
            <CustomButton
              style={{ color: "whitesmoke" }}
              className="home-card-button"
              onClick={() => navigate("/register")}
            >
              Kaydol
            </CustomButton>
          ) : (
            <CustomButton
              style={{ color: "whitesmoke" }}
              className="home-card-button"
              onClick={() => navigate("/apply")}
            >
              Başvur
            </CustomButton>
          )}
        </div>
        <div className="home-card">
          <PersonTwoToneIcon className="home-card-icon" />
          <div className="home-card-content">
            <div>Kendiniz Bilkenti</div>
            <div>Gezmek için</div>
          </div>
          <CustomButton
            style={{ color: "whitesmoke" }}
            className="home-card-button"
            onClick={handleOpenModal} // Opens modal
          >
            Başvur
          </CustomButton>
        </div>
      </div>
      {/* Modal for Email */}
      <Modal
        title="E-posta Adresinizi Girin"
        visible={isModalVisible}
        onOk={handleSubmitEmail} // Submits email
        onCancel={handleCloseModal} // Closes modal
        okText="Gönder"
        cancelText="İptal"
      >
        <Input
          placeholder="E-posta adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Updates email state
        />
      </Modal>
      <div class="home-team-header"> Bilkentle Tanışın </div>

      <div className="home-container-wrapper">
        {/* Card 1 */}
        <div className="home-info-card">
          <img
            src="education.jpg" // Replace with your image URL
            alt="Bilkent Kampüsü"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Üniversitesi, zengin lisans ve lisansüstü programlarıyla
            dünya standartlarında bir eğitimin kapılarını aralıyor! Geleceğinizi
            Bilkent’te şekillendirin!
          </div>
        </div>

        {/* Card 2 */}
        <div className="home-info-card">
          <img
            src="Bilkent.jpg" // Replace with your image URL
            alt="Akademik Başarılar"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Üniversitesi, modern tesisleriyle ve zengin spor
            olanaklarıyla futbol, basketbol, tenis ve yüzme gibi sporlar sunar.
            Aktif bir kampüs hayatı için sizi bekliyor!
          </div>
        </div>

        {/* Card 3 */}
        <div className="home-info-card">
          <img
            src="map.jpg" // Replace with your image URL
            alt="Kampüs Hayatı"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Üniversitesi, sosyal, kültürel ve akademik açıdan zengin bir
            kampüs hayatıyla sizi bekliyor! Kulüpler, etkinlikler ve modern
            tesisler, unutulmaz bir üniversite deneyimi sunuyor.
          </div>
        </div>
      </div>

      <div className="home-container-wrapper">
        {/* Burs Olanakları */}
        <div className="home-info-card">
          <img
            src="burs.jpg" // Replace with a relevant image URL for scholarships
            alt="Burs Olanakları"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Üniversitesi, öğrencilerinin %66’sına burs sağlayarak
            eğitimde fırsat eşitliğinin öncüsü! Lisans programlarında %44’lük
            burs oranıyla kaliteli eğitime kolayca ulaşabilirsiniz.
          </div>
        </div>

        {/* Kütüphane Hizmetleri */}
        <div className="home-info-card">
          <img
            src="library.jpg" // Replace with a relevant image URL for library services
            alt="Kütüphane Hizmetleri"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Üniversitesi Kütüphanesi, modern mimarisi ve geniş
            kaynaklarıyla Türkiye’nin önde gelen bilgi merkezlerinden biridir.
            1996 yılında 5. Ulusal Mimarlık Ödülleri Yapı Dalı Ödülü’ne layık
            görülmüştür.
          </div>
        </div>

        {/* Yurtlar ve Konaklama */}
        <div className="home-info-card">
          <img
            src="dorm.jpg" // Replace with a relevant image URL for dormitories
            alt="Yurtlar ve Konaklama"
            className="home-info-card-image"
          />
          <div className="home-info-card-text">
            Bilkent Yurtları, 26 modern binasıyla 4.800 öğrenciye güvenli ve
            konforlu bir yaşam sunuyor! 24 saat sıcak su, modern odalar ve
            harika bir kampüs ortamı sizleri bekliyor!
          </div>
        </div>
      </div>

      <div class="home-team-header">Ekibimiz</div>

      <div className="home-big-container">
        <div class="home-person-container">
          <div class="home-photo-container">
            <img src="orsanOrge.jpg" alt="Profile Photo" />
          </div>
          <div class="home-info-container">
            <h3>Örsan Örge</h3>
            <p>Program Director</p>
          </div>
        </div>

        <div class="home-person-container">
          <div class="home-photo-container">
            <img src="dilekyıldız.jpg" alt="Profile Photo" />
          </div>
          <div class="home-info-container">
            <h3>Dilek Yıldız</h3>
            <p>Human Resources</p>
          </div>
        </div>

        <div class="home-person-container">
          <div class="home-photo-container">
            <img src="borayguvenc.jpg" alt="Profile Photo" />
          </div>
          <div class="home-info-container">
            <h3>Boray Güvenç</h3>
            <p>Coordinator</p>
          </div>
        </div>

        <div class="home-person-container">
          <div class="home-photo-container">
            <img src="zehraiyigun.jpg" alt="Profile Photo" />
          </div>
          <div class="home-info-container">
            <h3>Zehra İyigün</h3>
            <p>Advisor</p>
          </div>
        </div>
      </div>

      <div className="home-communication-container">
        {/* Section 1: Footer Text */}
        <div className="footer-section">
          © 2024 Şirket MeetBilkent. Tüm hakları saklıdır.
        </div>

        {/* Section 2: Contact Us */}
        <div className="footer-section">
          <h4>Bize Ulaşın</h4>
          <p style={{ color: "white" }}>boray.guvenc@ug.bilkent.edu.tr</p>
          <p style={{ color: "white" }}>zehra.iyigun@ug.bilkent.edu.tr</p>
          <p style={{ color: "white" }}>Üniversiteler, 06800 Çankaya/Ankara, Türkiye</p>
        </div>

        <div className="footer-section">
          <h4>Bizi Takip Et</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>{" "}
            |
            <a href="#" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>{" "}
            |
            <a href="#" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
