import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoginPage from "./Pages/Login/LoginPage";
import RegisterPage from "./Pages/Register/RegisterPage";
import SchoolRegister from "./Pages/Register/SchoolRegister/SchoolRegister";
import GuideRegister from "./Pages/Register/GuideRegister/GuideRegister";
// import AboutUs from "./Pages/AboutUs/AboutUs";
import Profile from "./Pages/Profile/Profile";
import Applications from "./Pages/Applications/Applications";
import Guides from "./Pages/Guides/Guides";
import Help from "./Pages/Help/Help";
import Tours from "./Pages/Tours/Tours";
import Fairs from "./Pages/Fairs/Fairs";
import Schools from "./Pages/Schools/Schools";
import { AuthProvider, useAuth } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import AppBarComponent from "./Components/AppBarComponent/AppBarComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import Notifications from "./Pages/Notifications/Notifications";
import "./global.css";

function App() {
  const { role } = useAuth();
  const [calenderSchool1, setCalenderSchool1] = useState([]);
  const [calenderEvents1, setCalenderEvents1] = useState([]);
  const [calenderSchool2, setCalenderSchool2] = useState([]);
  const [calenderEvents2, setCalenderEvents2] = useState([]);

  const cities = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Amasya",
    "Ankara",
    "Antalya",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkari",
    "Hatay",
    "Isparta",
    "Mersin",
    "İstanbul",
    "İzmir",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Kahramanmaraş",
    "Mardin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Şanlıurfa",
    "Uşak",
    "Van",
    "Yozgat",
    "Zonguldak",
    "Aksaray",
    "Bayburt",
    "Karaman",
    "Kırıkkale",
    "Batman",
    "Şırnak",
    "Bartın",
    "Ardahan",
    "Iğdır",
    "Yalova",
    "Karabük",
    "Kilis",
    "Osmaniye",
    "Düzce",
  ];

  const schoolsList = [
    "Ankara Atatürk Anadolu Lisesi",
    "İzmir Fen Lisesi",
    "İstanbul Kabataş Erkek Lisesi",
    "Bursa Tofaş Fen Lisesi",
    "Antalya Gazi Anadolu Lisesi",
    "Adana Anadolu Lisesi",
    "Balıkesir Sırrı Yırcalı Anadolu Lisesi",
    "Trabzon Kanuni Anadolu Lisesi",
    "Konya Meram Fen Lisesi",
    "Diyarbakır Anadolu Lisesi",
    "Samsun Garip Zeycan Fen Lisesi",
    "Gaziantep Vehbi Dinçerler Fen Lisesi",
    "Kayseri Fen Lisesi",
    "Eskişehir Fatih Anadolu Lisesi",
    "Denizli Hakkı Dereköylü Güzel Sanatlar Lisesi",
    "Sakarya Cemil Meriç Sosyal Bilimler Lisesi",
    "Kocaeli Anadolu Lisesi",
    "Şanlıurfa Fen Lisesi",
    "Malatya Anadolu Lisesi",
    "Mersin Yusuf Kalkavan Anadolu Lisesi",
    "Erzurum Lisesi",
    "İzmit Fen Lisesi",
    "Manisa Anadolu Lisesi",
    "Hatay Reyhanlı Fen Lisesi",
    "Muğla Turgutreis Anadolu Lisesi",
    "Aydın Adnan Menderes Anadolu Lisesi",
    "Tekirdağ Ebru Nayim Fen Lisesi",
    "Van Mehmet Akif Ersoy Anadolu Lisesi",
    "Zonguldak Fen Lisesi",
    "Edirne Anadolu Lisesi",
    "Çanakkale Anadolu Lisesi",
    "Afyon Kocatepe Anadolu Lisesi",
    "Ordu Fen Lisesi",
    "Giresun Sosyal Bilimler Lisesi",
    "Sivas Fen Lisesi",
    "Isparta Süleyman Demirel Fen Lisesi",
    "Erzincan Anadolu Lisesi",
    "Balıkesir Ayvalık Anadolu Lisesi",
    "Amasya Macit Zeren Fen Lisesi",
    "Bolu Fen Lisesi",
    "Batman Anadolu Lisesi",
    "Kars Fen Lisesi",
    "Nevşehir Hacı Bektaş Anadolu Lisesi",
    "Artvin Fen Lisesi",
    "Ardahan Anadolu Lisesi",
    "Kütahya Fen Lisesi",
    "Bartın Anadolu Lisesi",
    "Yalova Fen Lisesi",
    "Niğde Fen Lisesi",
    "Çorum İskilip Anadolu Lisesi",
    "Tokat Gaziosmanpaşa Anadolu Lisesi",
    "Aksaray Süleyman Demirel Fen Lisesi",
    "Bayburt Fen Lisesi",
    "Burdur Fen Lisesi",
    "Osmaniye Fen Lisesi",
    "Düzce Fen Lisesi",
    "Karabük Demir Çelik Anadolu Lisesi",
    "Bingöl Anadolu Lisesi",
    "Mardin Fen Lisesi",
    "Elazığ Mehmet Akif Ersoy Anadolu Lisesi",
    "Rize Anadolu Lisesi",
    "Uşak Fen Lisesi",
    "Kırklareli Fen Lisesi",
    "Hakkari Anadolu Lisesi",
    "Bitlis Anadolu Lisesi",
    "Şırnak Fen Lisesi",
    "Yozgat Anadolu Lisesi",
    "Çankırı Fen Lisesi",
    "Tunceli Anadolu Lisesi",
    "Sinop Fen Lisesi",
    "Muş Anadolu Lisesi",
    "Siirt Fen Lisesi",
    "Kilis Anadolu Lisesi",
    "Karaman Fen Lisesi",
    "Kırıkkale Anadolu Lisesi",
    "Bilecik Fen Lisesi",
    "Bartın Fen Lisesi",
    "Ardahan Fen Lisesi",
    "Bitlis Fen Lisesi",
    "Bayburt Anadolu Lisesi",
    "Aksaray Fen Lisesi",
    "Tokat Fen Lisesi",
    "Afyon Anadolu Lisesi",
    "Çankırı Anadolu Lisesi",
    "Antalya Fen Lisesi",
    "İzmir Bornova Anadolu Lisesi",
    "İstanbul Kadıköy Anadolu Lisesi",
    "Ankara Tevfik Fikret Lisesi",
    "Bursa Anadolu İmam Hatip Lisesi",
    "Adana Anadolu İmam Hatip Lisesi",
    "Antalya Barbaros Anadolu Lisesi",
    "Diyarbakır Anadolu İmam Hatip Lisesi",
    "Hatay Anadolu Lisesi",
    "Erzurum Anadolu Lisesi",
    "İzmir Buca Fen Lisesi",
    "Konya Selçuklu Anadolu Lisesi",
    "Aydın Nazilli Fen Lisesi",
    "Tekirdağ Namık Kemal Anadolu Lisesi",
    "Sakarya Karasu Anadolu Lisesi",
    "Denizli Servergazi Anadolu Lisesi",
    "Balıkesir Bandırma Anadolu Lisesi",
    "Kayseri Kocasinan Fen Lisesi",
    "Samsun Çarşamba Fen Lisesi",
    "Ordu Anadolu İmam Hatip Lisesi",
    "Giresun Anadolu Lisesi",
    "Tokat Turhal Fen Lisesi",
    "Trabzon Yomra Fen Lisesi",
    "Mersin Tarsus Fen Lisesi",
    "Şanlıurfa Sosyal Bilimler Lisesi",
    "Gaziantep Nizip Fen Lisesi",
    "Kahramanmaraş Anadolu Lisesi",
    "Malatya Anadolu İmam Hatip Lisesi",
    "Çorum Osmancık Anadolu Lisesi",
    "Isparta Eğirdir Fen Lisesi",
    "Burdur Gölhisar Fen Lisesi",
    "Osmaniye Kadirli Fen Lisesi",
    "Batman Kozluk Anadolu Lisesi",
    "Adıyaman Kahta Anadolu Lisesi",
    "Ağrı Patnos Fen Lisesi",
    "Sivas Kangal Anadolu Lisesi",
    "Bolu Mengen Fen Lisesi",
    "Muş Anadolu İmam Hatip Lisesi",
    "Bingöl Genç Fen Lisesi",
    "Siirt Kurtalan Anadolu Lisesi",
    "Ardahan Çıldır Fen Lisesi",
    "Bayburt Demirözü Anadolu Lisesi",
    "Kırşehir Fen Lisesi",
    "Karabük Safranbolu Anadolu Lisesi",
    "Bartın Amasra Fen Lisesi",
    "Kastamonu Anadolu Lisesi",
    "Sinop Gerze Fen Lisesi",
    "Hakkari Yüksekova Fen Lisesi",
    "Şırnak Cizre Anadolu Lisesi",
    "Tunceli Mazgirt Fen Lisesi",
    "Van Gevaş Fen Lisesi",
    "Bitlis Tatvan Fen Lisesi",
    "Aksaray Anadolu İmam Hatip Lisesi",
    "Yozgat Boğazlıyan Fen Lisesi",
    "Kilis Anadolu İmam Hatip Lisesi",
    "Karaman Ermenek Fen Lisesi",
    "Afyon Dinar Fen Lisesi",
    "Zonguldak Devrek Fen Lisesi",
    "Ankara Gölbaşı Fen Lisesi",
  ];

  return (
    <Router className="body">
      <AppBarComponent role={role} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/help" element={<Help />} />
        <Route
          path="/register/school"
          element={<SchoolRegister schoolsList={schoolsList} cities={cities} />}
        />
        <Route path="/register/guide" element={<GuideRegister />} />
        <Route path="/home" element={<Home role={role} />} />
        <Route path="/" element={<Home role={role} />} />
        <Route
          path="/tours"
          element={
            <ProtectedRoute>
              <Tours
                role={role}
                calenderEvents1={calenderEvents1}
                setCalenderEvents1={setCalenderEvents1}
                calenderSchool1={calenderSchool1}
                setCalenderSchool1={setCalenderSchool1}
                calenderEvents2={calenderEvents2}
                setCalenderEvents2={setCalenderEvents2}
                calenderSchool2={calenderSchool2}
                setCalenderSchool2={setCalenderSchool2}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guides"
          element={
            <ProtectedRoute>
              <Guides role={role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fairs"
          element={
            <ProtectedRoute>
              <Fairs
                role={role}
                calenderEvents1={calenderEvents1}
                setCalenderEvents1={setCalenderEvents1}
                calenderSchool1={calenderSchool1}
                setCalenderSchool1={setCalenderSchool1}
                calenderEvents2={calenderEvents2}
                setCalenderEvents2={setCalenderEvents2}
                calenderSchool2={calenderSchool2}
                setCalenderSchool2={setCalenderSchool2}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools"
          element={
            <ProtectedRoute>
              <Schools role={role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile role={role} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
