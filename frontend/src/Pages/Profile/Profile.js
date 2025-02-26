import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "../../Axios";
import "./Profile.css";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { message, Input, Select, Modal } from 'antd';
import Calender from "../../Components/Calender/Calender";
import EditableSchedule from "../../Components/Schedule/Editable/EditableSchedule";
import { Box } from '@mui/material';
import { Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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


const Profile = ({ role }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myTours, setMyTours] = useState([]);
  const [myFairs, setMyFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  const [isPuantajModalVisible, setPuantajModalVisible] = useState(false); // Modal görünürlük durumu için state
  const [puantajValue, setPuantajValue] = useState(""); // Puantaj değeri için state

  const [seeCalender, setSeeCalender] = useState(false);

  const fetchFairs = async (idd) => {
    if (role === 'school') {
      Axios.get(`/api/fairs/all/accepted_school/${JSON.parse(localStorage.getItem("details")).school_name}`)
        .then((response) => {
          setMyFairs(response.data);
        })
        .catch((error) => {
          console.error("fetching fairs:", error.response?.data || error.message);
        });
    } else if (role === 'guide') {
      Axios.get(`/api/guides_fair/show_guide_assigns/${idd}`)
        .then((response) => {
          setMyFairs(response.data);
        })
        .catch((error) => {
          console.error("fetching fairs:", error.response?.data || error.message);
        });
    } else {
      Axios.get('/api/fairs/all/accepted')
        .then((response) => {
          setMyFairs(response.data);
        })
        .catch((error) => {
          console.error("fetching fairs:", error.response?.data || error.message);
        });
    }
  }

  const fetchTours = async (idd) => {
    if (role === 'school') {
      Axios.get(`/api/tours/all/accepted_school/${JSON.parse(localStorage.getItem("details")).school_name}`)
        .then((response) => {
          setMyTours(response.data);
        })
        .catch((error) => {
          console.error("fetching tours:", error.response?.data || error.message);
        });
    } else if (role === 'guide') {
      Axios.get(`/api/guides_tour/show_guide_assigns/${idd}`)
        .then((response) => {
          setMyTours(response.data);
        })
        .catch((error) => {
          console.error("fetching fairs:", error.response?.data || error.message);
        });
    } else {
      Axios.get('/api/tours/all/accepted')
        .then((response) => {
          setMyTours(response.data);
        })
        .catch((error) => {
          console.error("fetching tours:", error.response?.data || error.message);
        });
    }
  }

  const handleEdit = () => {
    if (role === 'guide') {
      Axios.post(`/api/guides/edit/${edit.user_id}`, edit)
        .then((response) => {
          //refresh
          console.log("response : ", response);
          window.location.reload();
          message.success("Güncelleme başarılı!");
        })
        .catch((error) => {
          message.error("Güncelleme başarısız!");
          console.error("Error updating the tour:", error.response?.data || error.message);
        });
    } else if (role === 'advisor') {
      Axios.post(`/api/advisors/edit/${edit.user_id}`, edit)
        .then((response) => {
          //refresh
          console.log("response : ", response);
          window.location.reload();
          message.success("Güncelleme başarılı!");
        })
        .catch((error) => {
          message.error("Güncelleme başarısız!");
          console.error("Error updating the tour:", error.response?.data || error.message);
        });
    } else if (role === 'school') {
      Axios.put(`/api/schools/edit/${edit.user_id}`, edit)
        .then((response) => {
          //refresh
          console.log("response : ", response);
          window.location.reload();
          message.success("Güncelleme başarılı!");
        })
        .catch((error) => {
          message.error("Güncelleme başarısız!");
          console.error("Error updating the tour:", error.response?.data || error.message);
        });
    } else {
      message.error("Kullanıcı bilgileri güncellenemedi!");
    }
    setEdit(null);
  }


  const handleCalender = () => {
    console.log("calender clicked")
  };

  const handlePuantajSave = () => {
    if (puantajValue && !isNaN(puantajValue)) {
      Axios.post(`/api/guides/add_puantaj/${user.id}`, { increment: puantajValue }) // Puantaj artırma isteği
        .then(() => {
          message.success("Puantaj başarıyla eklendi!");
          setPuantajModalVisible(false);
          setPuantajValue("");

          // return Axios.put(`/api/guides/update_puantaj_check/${user.id}`);
        })
        .then(() => {
          message.success("Puantaj kontrolü sıfırlandı!");
        })
        .catch((error) => {
          message.error("Bir hata oluştu.");
          console.error(error);
        });
    } else {
      message.error("Lütfen geçerli bir sayı giriniz!");
    }
    window.location.reload();
  };

  const handlePuantajCheck = () => {
    Axios.post(`/api/guides/false_puantaj_check/${user.id}`);
  }

  const [lockedSlots, setLockedSlots] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (localUser?.id) {
          let response;
          if (role === "school") {
            response = await Axios.get(`/api/schools/show/${localUser.id}`);
            fetchTours(localUser.id);
            fetchFairs(localUser.id);
          } else if (role === "guide") {
            response = await Axios.get(`/api/guides/show/${localUser.id}`);
            fetchTours(localUser.id);
            fetchFairs(localUser.id);
            setLockedSlots(response.data.free_time);
          } else if (role === "advisor") {
            response = await Axios.get(`/api/advisors/show/${localUser.id}`);
            fetchTours(localUser.id);
            fetchFairs(localUser.id);
          }

          if (response) {
            setUser(response.data);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [role]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Failed to load user data.</div>;

  // console.log("tour", myTours);
  // console.log("fair", myFairs);



  // const handleScheduleChange = (updatedLockedSlots) => {
  //   console.log("Updated Locked Slots:", updatedLockedSlots);
  //   setLockedSlots(updatedLockedSlots);
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '0px 50px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="profile-container" style={{ width: "800px", height: 'fit-content', margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>Profil</h2>
          <div className="profile-header" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img
              src={user.profile_picture_url || "https://via.placeholder.com/100"}
              alt="Profile"
              style={{ borderRadius: "50%", marginRight: "20px" }}
            />
            <div>
              <h3>{user.name ? user.name : user.school_name} <span style={{ fontWeight: "normal", color: "#888" }}>{role === 'guide' ? "(Rehber)" : role === 'advisor' ? "(Danışman)" : role === 'school' ? "" : "(Admin)"}</span></h3>
              {/* {role === 'guide' && <p>⭐ <span>{user.guide_rating ? user?.guide_rating : 0}</span></p>} */}
            </div>
          </div>

          {edit ?
            <>
              {role === 'guide' || role === 'advisor' ? (
                <div className="profile-details">
                  <div className="tour-card-detail-format">
                    <div className="tour-card-detail-format2">Cep Telefonu: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.phone || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          phone: e.target.value
                        }))
                      }
                    />
                  </div>
                  <br />
                  <div className="tour-card-detail-format">
                    <div className="tour-card-detail-format2">Departman: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.department || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          department: e.target.value
                        }))
                      }
                    />
                  </div>
                  <br />
                  <div className="tour-card-detail-format">
                    <div className="tour-card-detail-format2">Acil Durum Kişi İsmi: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.emergency_contact_name || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          emergency_contact_name: e.target.value
                        }))
                      }
                    />
                  </div>
                  <br />
                  <div className="tour-card-detail-format">
                    <div className="tour-card-detail-format2">Acil Durum İletişim Numarası: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.emergency_contact_phone || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          emergency_contact_phone: e.target.value
                        }))
                      }
                    />
                  </div>
                  <br />
                  <div className="tour-card-detail-format">
                    <div className="tour-card-detail-format2">Iban: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.iban_no || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          iban_no: e.target.value
                        }))
                      }
                    />
                  </div>
                  <Button
                    variant="text"
                    onClick={() => setSeeCalender((prev) => !prev)}
                    sx={{ marginTop: '0px' }}
                  >
                    {seeCalender ? "Programı Gizle" : "Programı Göster"}
                    {seeCalender ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Button>
                  <Collapse in={seeCalender}>
                    <Box
                      sx={{ marginTop: 2, lineHeight: 1.6, color: "text.secondary" }}
                    >
                      {role === 'guide' && seeCalender &&
                        <div style={{ margin: '0px', padding: '0px' }}>
                          <EditableSchedule
                            setEdit={setEdit}
                            edit={edit}
                            initialLockedSlots={lockedSlots}
                            change={edit ? true : false}
                          />
                        </div>
                      }
                    </Box>
                  </Collapse>

                </div>
              ) : (
                <>
                  <div className="tour-card-detail-format" style={{ marginBottom: '10px' }}>
                    <div className="tour-card-detail-format2">iletişim Numarası: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.user_phone || 'Belirtilmemiş'}
                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          user_phone: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="tour-card-detail-format" style={{ marginBottom: '10px' }}>
                    <div className="tour-card-detail-format2">Şehir: </div>
                    <Select
                      placeholder={user?.city || 'Belirtilmemiş'}
                      style={{ width: 300, backgroundColor: '#f8f9fa' }}
                      allowClear
                      variant="borderless"
                      onChange={(value) => setEdit({ ...edit, city: value })}
                      options={[
                        { value: 'Adana', label: 'Adana' },
                        { value: 'Adıyaman', label: 'Adıyaman' },
                        { value: 'Afyonkarahisar', label: 'Afyonkarahisar' },
                        { value: 'Ağrı', label: 'Ağrı' },
                        { value: 'Amasya', label: 'Amasya' },
                        { value: 'Ankara', label: 'Ankara' },
                        { value: 'Antalya', label: 'Antalya' },
                        { value: 'Artvin', label: 'Artvin' },
                        { value: 'Aydın', label: 'Aydın' },
                        { value: 'Balıkesir', label: 'Balıkesir' },
                        { value: 'Bilecik', label: 'Bilecik' },
                        { value: 'Bingöl', label: 'Bingöl' },
                        { value: 'Bitlis', label: 'Bitlis' },
                        { value: 'Bolu', label: 'Bolu' },
                        { value: 'Burdur', label: 'Burdur' },
                        { value: 'Bursa', label: 'Bursa' },
                        { value: 'Çanakkale', label: 'Çanakkale' },
                        { value: 'Çankırı', label: 'Çankırı' },
                        { value: 'Çorum', label: 'Çorum' },
                        { value: 'Denizli', label: 'Denizli' },
                        { value: 'Diyarbakır', label: 'Diyarbakır' },
                        { value: 'Edirne', label: 'Edirne' },
                        { value: 'Elazığ', label: 'Elazığ' },
                        { value: 'Erzincan', label: 'Erzincan' },
                        { value: 'Erzurum', label: 'Erzurum' },
                        { value: 'Eskişehir', label: 'Eskişehir' },
                        { value: 'Gaziantep', label: 'Gaziantep' },
                        { value: 'Giresun', label: 'Giresun' },
                        { value: 'Gümüşhane', label: 'Gümüşhane' },
                        { value: 'Hakkari', label: 'Hakkari' },
                        { value: 'Hatay', label: 'Hatay' },
                        { value: 'Isparta', label: 'Isparta' },
                        { value: 'Mersin', label: 'Mersin' },
                        { value: 'İstanbul', label: 'İstanbul' },
                        { value: 'İzmir', label: 'İzmir' },
                        { value: 'Kars', label: 'Kars' },
                        { value: 'Kastamonu', label: 'Kastamonu' },
                        { value: 'Kayseri', label: 'Kayseri' },
                        { value: 'Kırklareli', label: 'Kırklareli' },
                        { value: 'Kırşehir', label: 'Kırşehir' },
                        { value: 'Kocaeli', label: 'Kocaeli' },
                        { value: 'Konya', label: 'Konya' },
                        { value: 'Kütahya', label: 'Kütahya' },
                        { value: 'Malatya', label: 'Malatya' },
                        { value: 'Manisa', label: 'Manisa' },
                        { value: 'Kahramanmaraş', label: 'Kahramanmaraş' },
                        { value: 'Mardin', label: 'Mardin' },
                        { value: 'Muğla', label: 'Muğla' },
                        { value: 'Muş', label: 'Muş' },
                        { value: 'Nevşehir', label: 'Nevşehir' },
                        { value: 'Niğde', label: 'Niğde' },
                        { value: 'Ordu', label: 'Ordu' },
                        { value: 'Rize', label: 'Rize' },
                        { value: 'Sakarya', label: 'Sakarya' },
                        { value: 'Samsun', label: 'Samsun' },
                        { value: 'Siirt', label: 'Siirt' },
                        { value: 'Sinop', label: 'Sinop' },
                        { value: 'Sivas', label: 'Sivas' },
                        { value: 'Tekirdağ', label: 'Tekirdağ' },
                        { value: 'Tokat', label: 'Tokat' },
                        { value: 'Trabzon', label: 'Trabzon' },
                        { value: 'Tunceli', label: 'Tunceli' },
                        { value: 'Şanlıurfa', label: 'Şanlıurfa' },
                        { value: 'Uşak', label: 'Uşak' },
                        { value: 'Van', label: 'Van' },
                        { value: 'Yozgat', label: 'Yozgat' },
                        { value: 'Zonguldak', label: 'Zonguldak' },
                        { value: 'Aksaray', label: 'Aksaray' },
                        { value: 'Bayburt', label: 'Bayburt' },
                        { value: 'Karaman', label: 'Karaman' },
                        { value: 'Kırıkkale', label: 'Kırıkkale' },
                        { value: 'Batman', label: 'Batman' },
                        { value: 'Şırnak', label: 'Şırnak' },
                        { value: 'Bartın', label: 'Bartın' },
                        { value: 'Ardahan', label: 'Ardahan' },
                        { value: 'Iğdır', label: 'Iğdır' },
                        { value: 'Yalova', label: 'Yalova' },
                        { value: 'Karabük', label: 'Karabük' },
                        { value: 'Kilis', label: 'Kilis' },
                        { value: 'Osmaniye', label: 'Osmaniye' },
                        { value: 'Düzce', label: 'Düzce' }
                      ]}
                    />
                  </div>
                  <div className="tour-card-detail-format" style={{ marginBottom: '10px' }}>
                    <div className="tour-card-detail-format2">Notlar: </div>
                    <Input
                      className='tour-card-edit-tour-input'
                      placeholder={user?.notes?.[0]?.content ? (user.notes[0].content === '' ? '-' : user.notes[0].content) : '-'}

                      allowClear
                      variant="borderless"
                      onChange={(e) =>
                        setEdit((prev) => {
                          const newContent = e.target.value;
                          const currentDate = new Date().toISOString(); // Get the current timestamp

                          return {
                            ...prev,
                            notes: [
                              {
                                content: newContent,
                                created_at: currentDate,
                                // Keep the `id` and `school_id` if needed, fallback to defaults if not present
                                id: prev.notes?.[0]?.id || null,
                                school_id: prev.notes?.[0]?.school_id || null,
                              },
                            ],
                          };
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="tours-tour-card-buttons">
                <CustomButton className="tours-tour-card-button one" onClick={() => { setEdit(null); setSeeCalender(false); }} >Geri</CustomButton>
                <CustomButton className="tours-tour-card-button two" onClick={handleEdit} >Kaydet</CustomButton>
              </div>
            </>
            : (
              <>
                <div className="profile-details">


                  {(role === 'guide' || role === 'advisor') &&
                    <>
                      <p><strong>Email / Kullanıcı Adı:</strong> {user.username ? user.username : ""}</p>
                      <p><strong>Departman:</strong> {user.department ? user.department : "Belirtilmemiş"}</p>
                      <p><strong>Telefon:</strong> {user.phone ? user?.phone : user.user_phone ? user?.user_phone : "Belirtilmemiş"}</p>
                      <p><strong>Katılım Tarihi:</strong> {user?.start_date}</p>
                      <p><strong>Iban:</strong> {user.iban_no ? user.iban_no : "Belirtilmemiş"}</p>
                      <p><strong>Durum:</strong> {user?.isactive ? "Aktif" : "Aktif Değil"}</p>
                      <p><strong>Acil Durum Kişi İsmi:</strong> {user.emergency_contact_name ? user.emergency_contact_name : "Belirtilmemiş"}</p>
                      <p><strong>Acil Durum İletişim Numarası:</strong> {user.emergency_contact_phone ? user.emergency_contact_phone : "Belirtilmemiş"}</p>
                    </>
                  }

                  {(role === 'guide') &&
                    <>
                      <p><strong>Puantaj:</strong> {user?.puantaj ? user?.puantaj : 0}</p>
                      <Button
                        variant="text"
                        onClick={() => setSeeCalender((prev) => !prev)}
                        sx={{ marginTop: '0px' }}
                      >
                        {seeCalender ? "Programı Gizle" : "Programı Göster"}
                        {seeCalender ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Button>
                      <Collapse in={seeCalender}>
                        <Box
                          sx={{ marginTop: 2, lineHeight: 1.6, color: "text.secondary" }}
                        >
                          {role === 'guide' && seeCalender && (
                            <div style={{ margin: '0px', padding: '0px' }}>
                              <EditableSchedule
                                setEdit={setEdit}
                                edit={edit}
                                initialLockedSlots={lockedSlots}
                                change={edit ? true : false}
                              />
                            </div>
                          )}
                        </Box>
                      </Collapse>
                      {/* <p><strong>Puantaj Check:</strong> {user?.puantaj_check ? "Evet" : "Hayır"}</p> */}
                    </>
                  }
                  {role === 'school' &&
                    <>
                      <p><strong>Okul Sorumlusu:</strong> {user.username ? user.username : ""}</p>
                      <p><strong>Telefon:</strong> {user.phone ? user?.phone : user.user_phone ? user?.user_phone : "Belirtilmemiş"}</p>
                      <p><strong>Şehir:</strong> {user.city ? user.city : "Belirtilmemiş"}</p>
                      <p><strong>Notlar:</strong> {user?.notes?.[0]?.content ? (user.notes[0].content === '' ? '-' : user.notes[0].content) : '-'}
                      </p>
                    </>
                  }
                </div>
                <div className="tours-tour-card-buttons" style={{ marginTop: "20px" }}>
                  {role === "guide" && (
                    <CustomButton className='tours-tour-card-button two'
                      onClick={() => setPuantajModalVisible(true)}
                      disabled={!user.puantaj_check}
                      style={{
                        opacity: user.puantaj_check ? 1 : 0.5,
                        cursor: user.puantaj_check ? "pointer" : "not-allowed",
                      }}>Puantaj Ekle</CustomButton>
                  )}
                  <CustomButton className='tours-tour-card-button one' onClick={() => setEdit(user)}>Düzenle</CustomButton>
                  {/* <CustomButton className='tours-tour-card-button two' onClick={handleCalender} >Calendar'ı Gör</CustomButton> */}
                </div>
                {/* Puantaj Modal */}
                <Modal
                  title="Puantaj Ekle"
                  visible={isPuantajModalVisible}
                  onOk={() => {
                    handlePuantajSave();
                    handlePuantajCheck();
                  }}   // Kaydet butonu
                  onCancel={() => setPuantajModalVisible(false)} // İptal butonu
                  okText="Kaydet"
                  cancelText="İptal"
                >
                  <p>Lütfen bir puantaj değeri girin:</p>
                  <Input
                    type="number"
                    value={puantajValue}
                    onChange={(e) => setPuantajValue(e.target.value)}
                    placeholder="Puantaj değeri"
                  />
                </Modal>
              </>
            )}
        </div >
      </div>
      {user.isactive !== false &&
        <div className="profile-container" style={{ maxWidth: "800px", height: '800px', margin: "0 auto", marginBottom: '20px', padding: "20px 20px 0px 20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <Calender role={role} upcomingEvents={myFairs} previousEvents={myTours} />
          <p style={{ margin: '0px', textAlign: 'center' }}>
            <strong style={{ color: '#ec2f38', fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/fairs')}>Fuarlar</strong>
            -
            <strong style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/tours')}>Turlar</strong>
          </p>
        </div>
      }
    </div>
  );
};

export default Profile;