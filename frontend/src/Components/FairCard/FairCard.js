import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import './FairCard.css';
import Axios from '../../Axios';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Tabs, message, Input, Select, ConfigProvider, DatePicker, TimePicker, Modal } from 'antd';
import trTR from 'antd/lib/locale/tr_TR';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import SchoolFairCard from './SchoolFairCard/SchoolFairCard';

dayjs.locale('tr');

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

const { TabPane } = Tabs;

const FairCard = ({ role, fairs, setFairs, setChosenFair, chosenFair, chosenPendingFairCard,
    setChosenPendingFairCard, chosenFinalFairCard, setChosenFinalFairCard, setUpdateGuides, updateGuides,
    chosenRejectedFairCard, setChosenRejectedFairCard,
    chosenPastFairCard, setChosenPastFairCard, schosenPastFairCard, ssetChosenPastFairCard, schosenPendingFairCard, ssetChosenPendingFairCard,
    schosenUpcomingFairCard, ssetChosenUpcomingFairCard, schosenRejectedFairCard, ssetChosenRejectedFairCard,
    setCalenderEvents1, setCalenderSchool1,
    setCalenderEvents2, setCalenderSchool2 }) => {

    const [allGuides, setAllGuides] = useState([]);
    const [schools, setSchools] = useState([]);
    const [fairGuides, setFairGuides] = useState([]);
    const [chosenFairAssignedGuides, setChosenFairAssignedGuides] = useState([]);
    const [chosenFairRequestedGuides, setChosenFairRequestedGuides] = useState([]);
    const [activeTab, setActiveTab2] = useState("1");
    const [pending_fairs, setPendingFairs] = useState([]);
    const [bto_onay_fairs, setBTOOnayFairs] = useState([]);
    const [final_fairs, setFinalFairs] = useState([]);
    const [rejected_fairs, setRejectedFairs] = useState([]);
    const [editedFair, setEditFair] = useState(null);
    const [activee, setActive] = useState(true);
    // const [chosenPendingFairCard, setChosenPendingFairCard] = useState(null);
    // const [chosenFinalFairCard, setChosenFinalFairCard] = useState(null);
    // const [chosenPastFairCard, setChosenPastFairCard] = useState(null);
    // const [chosenRejectedFairCard, setChosenRejectedFairCard] = useState(null);

    const [schoolPending, setSchoolPending] = useState([]);

    // FEEDBACK //
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [isModalVisible4, setIsModalVisible4] = useState(false);
    const [feedback, setFeedback] = useState("");


    // ADVISOR ACCEPT
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        Axios.post(`/api/fairs/advisor/accept_fair/${chosenPendingFairCard.id}?feedback=${feedback}`)
            .then(() => {
                fetchAllFairs();
                setChosenFair(null);
                setChosenPendingFairCard(null);
                message.success("Başvuru kabul edildi. Son onay bekleniyor!");
            })
            .catch((error) => {
                console.log(error);
            });
        setIsModalVisible(false);
        setFeedback("");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFeedback("");
    };


    // ADVISOR REJECT
    const showModal2 = () => {
        setIsModalVisible2(true);
    };

    const handleOk2 = () => {
        Axios.post(`/api/fairs/advisor/reject_fair/${chosenPendingFairCard.id}?feedback=${feedback}`)
            .then(() => {
                fetchAllFairs();
                setChosenPendingFairCard(null);
                setChosenFair(null);
                message.error('Fuar reddedildi!')
            })
            .catch((error) => {
                console.log(error);
            });
        setIsModalVisible2(false);
        setFeedback("");
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
        setFeedback("");
    };


    // SUDO ACCEPT
    const showModal3 = () => {
        setIsModalVisible3(true);
    };

    const handleOk3 = () => {
        handleAcceptFair(chosenFair.id);
        setIsModalVisible3(false);
        setFeedback("");
    };

    const handleCancel3 = () => {
        setIsModalVisible3(false);
        setFeedback("");
    };


    // SUDO REJECT
    const showModal4 = () => {
        setIsModalVisible4(true);
    };

    const handleOk4 = () => {
        handleRejectFair(chosenFair.id);
        setIsModalVisible4(false);
        setFeedback("");
    };

    const handleCancel4 = () => {
        setIsModalVisible4(false);
        setFeedback("");
    };

    // FEEDBACK //


    const setActiveTab = (key) => {
        setActiveTab2(key);
        setChosenFinalFairCard(null);
        setChosenRejectedFairCard(null);
        setChosenPastFairCard(null);
        setChosenFair(null);
        setChosenPendingFairCard(null);
    }

    useEffect(() => {
        if (role === 'guide') {
            setActiveTab("2");
        }
        else if (role === 'school') {
            setActiveTab("6");
        }
    }, [role]);


    const handleFairCardClick = (id) => {
        setChosenFair(fairs.find(a => a.id === id));
    };

    const handleUpdateGuideClick = () => {
        setUpdateGuides(true);
    };

    const handleRemoveGuideClick = (guideId, fairId) => {
        Axios.delete(`/api/guides_fair/cancel_guides_assigned_fair/${guideId}/${fairId}`)
            .then(() => {
                setFairGuides(fairGuides.filter(fairGuide => fairGuide.id !== guideId));
                getGuides();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleAssignGuideClick = async (guideId, fairId) => {
        try {
            // Step 1: Assign the guide
            const assignResponse = await Axios.post(`/api/guides_fair/assign_guide/${guideId}/${fairId}`);
            setFairGuides([...fairGuides, assignResponse.data]);
            getGuides();
        } catch (error) {
            console.error("Error assigning guide:", error);
            return; // Exit early if assigning the guide fails
        }
    
        let fair = null;
        try {
            // Step 2: Get fair info
            const fairResponse = await Axios.get(`/api/fairs/show/${fairId}`);
            fair = fairResponse.data;
            console.log("Fair fetched successfully:", fair);
        } catch (error) {
            console.error("Error fetching fair info:", error.message);
            return; // Exit early if fetching fair info fails
        }
    
        // Step 3: Create the notification object
        const notification = {
            title: "Fuar Rehberi Ataması", // Title of the notification
            message: `Merhaba, 
            ${fair.high_school_name} okuluna ${fair.date} tarihi için rehber olarak atandınız. 
            Detaylar için 'Turlarım' sayfasına bakabilirsiniz.
            Eğer bu görevi yerine getiremeyecekseniz lütfen fuar gününe ait sorumlu danışmanınız ile iletişime geçiniz.
            Sevgiyle kalın. Biz bir aileyiz <3
            -Sistem`, // Notification message
            user_id: guideId,             // Associated guide ID
            created_at: new Date(),        // Timestamp
        };
    
        try {
            // Step 4: Send the notification
            const notificationResponse = await Axios.post(`/api/notifications/add/${guideId}`, notification);
            console.log("Notification sent successfully:", notificationResponse.data);
        } catch (error) {
            console.error("Error sending notification:", error.message);
        }
    };
    

    const handleRejectFair = async (id) => {
        if (role === 'advisor') {
            Axios.post(`/api/fairs/advisor/reject_fair/${id}?feedback=${feedback}`)
                .then(() => {
                    fetchAllFairs();
                    setChosenPendingFairCard(null);
                    message.error('Fuar reddedildi!')
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            Axios.post(`/api/fairs/sudo/reject_fair/${id}?feedback=${feedback}`)
                .then(() => {
                    fetchAllFairs();
                    setChosenFair(null);
                    setChosenPendingFairCard(null);
                    message.success('Fuar kalıcı olarak reddedildi!')
                }
                )
                .catch((error) => {
                    console.log(error);
                });
            setChosenFair(null);
            

            // get the fair
            let fair = null;
        try {
            // Step 2: Get fair info
            const fairResponse = await Axios.get(`/api/fairs/show/${id}`);
            fair = fairResponse.data;
            console.log("Fair fetched successfully:", fair);
        } catch (error) {
            console.error("Error fetching fair info:", error.message);
            return; // Exit early if fetching fair info fails
        }

            // get the school
            const school_id = fair.school_id
            let school = null;
            try {
                // Step 2: Get fair info
                const schoolResponse = await Axios.get(`/api/schools/show/${school_id}`);
                school = schoolResponse.data;
                console.log("School fetched successfully:", school);
            } catch (error) {
                console.error("Error fetching school info:", error.message);
                return; // Exit early if fetching fair info fails
            }

            //notification object
            // Step 3: Create the notification object
        const notification = {
            title: "Fuar Rehberi Ataması", // Title of the notification
            message: `Merhaba ${school.school_name}
            Yapmış olduğunuz ${fair.date} tarihli fuar için üzülerek katılamayacağımızı bildirmek istiyoruz.
            
            Yönetici mesajı şu şekilde :
            
            ${feedback}
        
            `, // Notification message
            user_id: school_id,             // Associated guide ID
            created_at: new Date(),        // Timestampi
        };



            // notify the school

            try {
                // Step 4: Send the notification
                const notificationResponse = await Axios.post(`/api/notifications/add/${school_id}`, notification);
                console.log("Notification sent successfully:", notificationResponse.data);
            } catch (error) {
                console.error("Error sending notification:", error.message);
            }
        }
    }


    const handleAcceptFair = async (id) => {
        if (role === "advisor") {
            Axios.post(`/api/fairs/advisor/accept_fair/${id}?feedback=${feedback}`)
                .then(() => {
                    fetchAllFairs();
                    setChosenPendingFairCard(null);
                    message.success("Başvuru kabul edildi. Son onay bekleniyor!");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            Axios.post(`/api/fairs/sudo/accept_fair/${id}?feedback=${feedback}`)
                .then(() => {
                    fetchAllFairs();
                    setChosenFair(null);
                    setChosenPendingFairCard(null);
                    message.success("Fuar başarıyla onaylandı!");
                })
                .catch((error) => {
                    console.log(error);
                });
             // Notification part

            // get the fair
            let fair = null;
            try {
                // Step 2: Get fair info
                const fairResponse = await Axios.get(`/api/fairs/show/${id}`);
                fair = fairResponse.data;
                console.log("Fair fetched successfully:", fair);
            } catch (error) {
                console.error("Error fetching fair info:", error.message);
                return; // Exit early if fetching fair info fails
            }
    
                // get the school
                const school_id = fair.school_id
                let school = null;
                try {
                    // Step 2: Get fair info
                    const schoolResponse = await Axios.get(`/api/schools/show/${school_id}`);
                    school = schoolResponse.data;
                    console.log("School fetched successfully:", school);
                } catch (error) {
                    console.error("Error fetching school info:", error.message);
                    return; // Exit early if fetching fair info fails
                }
    
                //notification object
                // Step 3: Create the notification object
            const notification = {
                title: "Fuar Rehberi Ataması", // Title of the notification
                message: `Merhaba ${school.school_name}
                Yapmış olduğunuz ${fair.date} tarihli fuara katılacağımızı mutlulukla belirtmek istiyoruz. Bizi ağırladığınız için şimdiden çok teşekkürler.
                
                Yönetici mesajı şu şekilde :
                
                ${feedback}
            
                `, // Notification message
                user_id: school_id,             // Associated guide ID
                created_at: new Date(),        // Timestampi
            };

    
    
    
                // notify the school
    
                try {
                    // Step 4: Send the notification
                    const notificationResponse = await Axios.post(`/api/notifications/add/${school_id}`, notification);
                    console.log("Notification sent successfully:", notificationResponse.data);
                } catch (error) {
                    console.error("Error sending notification:", error.message);
                }
            }

        };

    useEffect(() => {
        if (role === 'guide' && JSON.parse(localStorage.getItem("details")).isactive === false) {
            setActive(false);
        }
    }, []);

    const fetchAllFairs = () => {
        Axios.get("/api/fairs/all")
            .then((response) => {
                setFairs(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    

    useEffect(() => {
        Axios.get('/api/schools/all')
            .then((response) => {
                setSchools(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (role === 'guide' && JSON.parse(localStorage.getItem("details")).isactive === false) {
            setActive(false);
        }
    }, []);

    const handleCancelFairGuideRequest = (fairId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIdd = user?.id;
        Axios.delete(`/api/guides_fair/cancel_guides_requested_fair/${userIdd}/${fairId}`)
            .then((response) => {
                if (response.status === 204 || response.status === 200) {
                    message.success('Rehberlik talebiniz iptal edildi!');
                    fetchAllFairs();
                    getGuides();
                } else {
                    throw new Error("Unexpected response status");
                }
            })
            .catch((error) => {
                console.log("Error details:", error.response || error);
                message.error('Talebiniz iptal edilemedi!');
            });
    }


    const handleGuideRequest = (fairId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIdd = user?.id;
        // console.log("userIdd", userIdd);
        Axios.post(`/api/guides_fair/request_guideness/${userIdd}/${fairId}`)
            .then(() => {
                fetchAllFairs();
                getGuides();
                message.success('Rehberlik talebiniz başarıyla iletildi!')
            })
            .catch((error) => {
                console.log(error);
            });
    }


    //get guides
    const getGuides = () => {
        Axios.get('/api/guides_fair/all')
            .then((response) => {
                setFairGuides(response.data);
                // console.log("fair guidessss", response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }



    useEffect(() => {
        Axios.get('/api/guides/all')
            .then((response) => {
                setAllGuides(response.data);
                // console.log("all guides", response.data)
            })
            .catch((error) => {
                console.log(error);
            });

        getGuides();
    }, []);


    // EDIT TOUR INFO
    const handleSaveEditedFair = () => {
        // console.log("SENDED TOUR: ", editedFair);
        Axios.patch(`/api/fairs/edit/${editedFair.id}`, editedFair)
            .then((response) => {
                fetchAllFairs();
                // console.log("Fair updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating the fair:", error.response?.data || error.message);
            });
        setChosenFair(editedFair);
        setEditFair(null);
    }


    const filterPreviousFairs = (fairList) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return fairList.filter((fair) => {
            const fairDate = new Date(fair.date);
            fairDate.setHours(0, 0, 0, 0);

            // console.log(`Fair Date: ${fairDate}, Today: ${today}, Is Previous: ${fairDate < today}`);
            return fairDate < today;
        });
    };

    const filterUpcomingFairs = (fairList) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return fairList.filter((fair) => {
            const fairDate = new Date(fair.date);
            fairDate.setHours(0, 0, 0, 0);

            // console.log(`Fair Date: ${fairDate}, Today: ${today}, Is Previous: ${fairDate < today}`);
            return fairDate >= today;
        });
    };

    const updateFairGuidesCheck = (previousFairs) => {
        setFairGuides((prevFairGuides) =>
            prevFairGuides.map((guide) => {
                // Eğer guide'ın bağlı olduğu fuar geçmişse, Check değerini güncelle
                if (previousFairs.some(fair => fair.id === guide.fair_id)) {
                    return { ...guide, puantaj_check: true };
                }
                return guide; // Diğerlerini olduğu gibi bırak
            })
        );
    };

    useEffect(() => {
        const previous = filterPreviousFairs(final_fairs);
        setPreviousFairs(previous);

        // Geçmiş fuarları kontrol edip `Check` değerini güncelle
        updateFairGuidesCheck(previous);
    }, [final_fairs]);


    useEffect(() => {
        const assignedGuides = fairGuides
            .filter(fairGuide => fairGuide.status === 'ASSIGNED')
            .map(fairGuide => {
                const guide = allGuides.find(g => g.user_id === fairGuide.guide_id);
                return guide ? { ...fairGuide, ...guide } : null;  // Combine fairGuide and guide attributes
            })
            .filter(guide => guide);  // Remove any null values
        setChosenFairAssignedGuides(assignedGuides);
        // console.log("asssss", assignedGuides);

        const requestedGuides = fairGuides
            .filter(fairGuide => fairGuide.status === 'REQUESTED')
            .map(fairGuide => {
                const guide = allGuides.find(g => g.user_id === fairGuide.guide_id);
                return guide ? { ...fairGuide, ...guide } : null;  // Combine fairGuide and guide attributes
            })
            .filter(guide => guide);
        setChosenFairRequestedGuides(requestedGuides);
        // console.log("reqqqq", requestedGuides); 
    }, [allGuides, fairGuides]);


    const handleOutDated = (rrr) => {
        // console.log("outdateda girennnnnnnn", rrr);
        const prev = filterPreviousFairs(rrr);
        // console.log("prevvvvvvvvvvv", prev);
        prev.forEach((fair) => {
            Axios.post(`/api/fairs/sudo/reject_fair/${fair.id}?feedback=Tarihi geçmiş`)
                .then(() => {
                    console.log(`Fuar ${fair.id} tarihi geçtiği için reddedildi!`);
                    fetchAllFairs();
                })
                .catch((error) => {
                    console.log(`Fuar ${fair.id} tarihi geçtiği için reddedilemedi: `, error);
                    // message.error(`Fuar ${fair.id} reddedilemedi!`);
                });
        });
    }


    useEffect(() => {
        handleOutDated(schoolPending);
    }, [schoolPending, final_fairs]);

    useEffect(() => {
        setPendingFairs(fairs.filter((fair) => fair.confirmation === 'PENDING'));
    }, [fairs]);

    useEffect(() => {
        setBTOOnayFairs(fairs.filter((fair) => fair.confirmation === 'BTO ONAY'));
    }, [fairs]);

    useEffect(() => {
        setFinalFairs(fairs.filter((fair) => fair.confirmation === 'ONAY'));
    }, [fairs]);

    useEffect(() => {
        setSchoolPending(fairs.filter((fair) => fair.confirmation === 'PENDING' || fair.confirmation === 'BTO ONAY'));
    }, [fairs]);

    useEffect(() => {
        setRejectedFairs(fairs.filter((fair) => (fair.confirmation === 'RET' || fair.confirmation === 'BTO RET')));
    }, [fairs]);



    const [previousFairs, setPreviousFairs] = useState([]);
    const [upcomingFairs, setUpcomingFairs] = useState([]);

    useEffect(() => {
        setPreviousFairs(filterPreviousFairs(final_fairs));
        setUpcomingFairs(filterUpcomingFairs(final_fairs));
        setCalenderEvents1(filterPreviousFairs(final_fairs));
        setCalenderEvents2(filterUpcomingFairs(final_fairs));
    }, [final_fairs]);


    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa: ", chosenFairAssignedGuides);

    return (
        <>
            <div className="fair-card-tabs-outer-cont" >

                {activee ?

                    role === 'school' ?
                        <SchoolFairCard pending={schoolPending}
                            upcoming={upcomingFairs}
                            rejected={rejected_fairs}
                            previous={previousFairs}
                            fetchAllFairs={fetchAllFairs}
                            schosenPastFairCard={schosenPastFairCard}
                            schosenPendingFairCard={schosenPendingFairCard}
                            schosenUpcomingFairCard={schosenUpcomingFairCard}
                            schosenRejectedFairCard={schosenRejectedFairCard}
                            ssetChosenPastFairCard={ssetChosenPastFairCard}
                            ssetChosenPendingFairCard={ssetChosenPendingFairCard}
                            ssetChosenUpcomingFairCard={ssetChosenUpcomingFairCard}
                            ssetChosenRejectedFairCard={ssetChosenRejectedFairCard}
                            chosenFairAssignedGuides={chosenFairAssignedGuides}
                            setCalenderSchool2={setCalenderSchool2}
                            setCalenderSchool1={setCalenderSchool1}
                        />
                        :
                        <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>

                            {/* ILK BAŞVURU  */}
                            {((role === 'admin') || (role === 'advisor')) &&
                                <TabPane tab={<span className="fair-card-custom-tab-headers" >Başvurular</span>} key="1" >
                                    {!chosenPendingFairCard ?
                                        (pending_fairs.length === 0 ? (
                                            <p>Fuar başvurusu bulunmamaktadır.</p>
                                        ) : (
                                            <div>
                                                {pending_fairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                                                    <div key={index} className="fairs-fair-card" onClick={() => setChosenPendingFairCard(fair)}>
                                                        <div className="fairs-fair-header">
                                                            <div className="fairs-fair-location">
                                                                {fair.city || "Belirtilmemiş"}
                                                            </div>
                                                            <div className="fairs-fair-datetime">
                                                                <div className="fairs-fair-date">
                                                                    <CalendarMonthTwoToneIcon />
                                                                    <>
                                                                        {new Date(fair.date).toLocaleDateString('tr-TR', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                        })}
                                                                    </>
                                                                </div>
                                                                <div className="fairs-fair-time">
                                                                    <AccessTimeTwoToneIcon />
                                                                    <>
                                                                        {new Date(fair.date).toLocaleTimeString('tr-TR', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="fairs-fair-body">
                                                            <div className="fairs-fair-school">
                                                                {fair.high_school_name}
                                                            </div>
                                                            <div className="fairs-fair-details">
                                                                {fair?.student_count} Davetli
                                                            </div>
                                                        </div>

                                                        <div className="fairs-fair-footer">
                                                            <div className="fairs-fair-rating">
                                                                <span>{schools.find((school) => school.school_name === fair.high_school_name)?.rate || "Belirtilmemiş"}</span> <i className="fa fa-star"></i> <StarIcon />
                                                                {/* SHOOL RATE HERE */}
                                                            </div>
                                                        </div>


                                                    </div>
                                                ))}
                                            </div>
                                        )
                                        )
                                        : (
                                            <div className="fairs-fair-card non-clickable">
                                                <Tooltip title='Geri'>
                                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setChosenPendingFairCard(null)}>
                                                        <KeyboardBackspaceIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <div className="fairs-fair-card-detail-header">{chosenPendingFairCard.high_school_name}</div>
                                                <div className="fairs-fair-card-details">
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Şehir: </div>
                                                        <div>{chosenPendingFairCard?.city || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                                        <div>{chosenPendingFairCard?.school_email || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu: </div>
                                                        <div>{chosenPendingFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                        <div>{chosenPendingFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                        <div>{chosenPendingFairCard?.student_count || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Tarih:</div>
                                                        <div>
                                                            {new Date(chosenPendingFairCard.date).toLocaleDateString('tr-TR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Saat:</div>
                                                        <div>
                                                            {new Date(chosenPendingFairCard.date).toLocaleTimeString('tr-TR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Misafir Notu: </div>
                                                        <div>{chosenPendingFairCard?.notes || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                </div>
                                                <div className="fairs-fair-card-buttons">
                                                    <CustomButton className="fairs-fair-card-button one" onClick={showModal}>Fuarı Onayla</CustomButton>
                                                    <Modal
                                                        title="Başvuruyu Kabul Et"
                                                        visible={isModalVisible}
                                                        onOk={handleOk}
                                                        onCancel={handleCancel}
                                                        okText="Onayla"
                                                        cancelText="İptal"
                                                    >
                                                        <p>Başvuruyu kabul etmek istediğinizden emin misiniz?</p>
                                                        <Input.TextArea
                                                            value={feedback}
                                                            onChange={(e) => setFeedback(e.target.value)}
                                                            placeholder="Eklemek istediğiniz bir not var mı? (Opsiyonel)"
                                                            rows={4}
                                                        />
                                                    </Modal>
                                                    <CustomButton className="fairs-fair-card-button two" onClick={showModal2}>Fuarı Reddet</CustomButton>
                                                    <Modal
                                                        title="Başvururyu Reddet"
                                                        visible={isModalVisible2}
                                                        onOk={handleOk2}
                                                        onCancel={handleCancel2}
                                                        okText="Onayla"
                                                        cancelText="İptal"
                                                    >
                                                        <p>Başvuruyu kalıcı olarak reddetmek istediğinizden emin misiniz? Bu işlem sorumluya bildirilir!</p>
                                                        <Input.TextArea
                                                            value={feedback}
                                                            onChange={(e) => setFeedback(e.target.value)}
                                                            placeholder="Eklemek istediğiniz bir not var mı? (Opsiyonel)"
                                                            rows={4}
                                                        />
                                                    </Modal>
                                                </div>
                                            </div>
                                        )}
                                </TabPane>
                            }




                            {/* GUIDE ATAMASI SÜREN / BTO ONAYI BEKLEYENLER */}
                            {((role === 'admin') || (role === 'advisor') || (role === 'guide')) &&
                                <TabPane tab={<span className="fair-card-custom-tab-headers">Onay Bekleyen Fuarlar</span>} key="2" >
                                    {!chosenFair ?
                                        (bto_onay_fairs.length === 0 ? (
                                            <p>Onaylanacak fuar bulunmamaktadır.</p>
                                        ) : (
                                            bto_onay_fairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                                                <div key={index} className="fairs-fair-card" onClick={() => handleFairCardClick(fair.id)}>
                                                    <div className="fairs-fair-header">
                                                        <div className="fairs-fair-location">
                                                            {fair.city || "Belirtilmemiş"}
                                                        </div>
                                                        <div className="fairs-fair-datetime">
                                                            <div className="fairs-fair-date">
                                                                <CalendarMonthTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}
                                                                </>
                                                            </div>
                                                            <div className="fairs-fair-time">
                                                                <AccessTimeTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleTimeString('tr-TR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-body">
                                                        <div className="fairs-fair-school">
                                                            {fair.high_school_name}
                                                        </div>
                                                        <div className="fairs-fair-details">
                                                            {fair?.student_count} Davetli
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-footer">
                                                        <div className="fairs-fair-rating">
                                                            <span>{schools.find((school) => school.school_name === fair.high_school_name)?.rate || "Belirtilmemiş"}</span> <i className="fa fa-star"></i> <StarIcon />
                                                        </div>
                                                        <div className="fairs-fair-guide-info">
                                                            {chosenFairAssignedGuides.filter(g => g.fair_id === fair.id).length} / {Math.ceil(fair.student_count)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                        ) : (
                                            <div className="fairs-fair-card non-clickable" >
                                                {!updateGuides && !editedFair ? (
                                                    <>
                                                        <Tooltip title='Geri'>
                                                            <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setChosenFair(null)}>
                                                                <KeyboardBackspaceIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <div className="fairs-fair-card-detail-header">{chosenFair.high_school_name}</div>
                                                        <div className="fairs-fair-card-details">
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Şehir: </div>
                                                                <div>{chosenFair?.city || 'Belirtilmemiş'}</div>

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                                                <div>{chosenFair?.school_email || 'Belirtilmemiş'}</div>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu: </div>
                                                                <div>{chosenFair?.teacher_name || 'Belirtilmemiş'}</div>

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                                <div>{chosenFair?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                                <div>{chosenFair?.student_count || 'Belirtilmemiş'}</div>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Tarih:</div>
                                                                <div>
                                                                    {new Date(chosenFair.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Saat:</div>
                                                                <div>
                                                                    {new Date(chosenFair.date).toLocaleTimeString('tr-TR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Misafir Notu: </div>
                                                                <div>{chosenFair?.notes || 'Belirtilmemiş'}</div>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Onaylayan Advisor Notu: </div>
                                                                <div>{chosenFair?.feedback || 'Belirtilmemiş'}</div>
                                                            </div>
                                                            <br />
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Atanmış Rehberler ({chosenFairAssignedGuides.filter(guide => guide.fair_id === chosenFair.id).length} / {Math.ceil(chosenFair.student_count)}):  </div>
                                                                <div className="req-ass-content">
                                                                    {chosenFairAssignedGuides.filter(g => g.fair_id === chosenFair.id).map((guide, index) => (
                                                                        <span key={guide.id}>
                                                                            {guide.name}{index < chosenFairAssignedGuides.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="fairs-fair-card-buttons"> */}
                                                        {role === 'guide' ?
                                                            <>
                                                                {chosenFairRequestedGuides.some(
                                                                    (guide) =>
                                                                        guide.fair_id === chosenFair.id &&
                                                                        guide.guide_id === JSON.parse(localStorage.getItem("user")).id
                                                                )
                                                                    ?
                                                                    <div className="fairs-fair-card-buttons">
                                                                        <CustomButton disabled className="fairs-fair-card-button special" >Talep Oluşturuldu!</CustomButton>
                                                                        <CustomButton className="fairs-fair-card-button one" onClick={() => handleCancelFairGuideRequest(chosenFair.id)} >Talebi iptal et</CustomButton>
                                                                    </div>
                                                                    :
                                                                    chosenFairAssignedGuides.some(
                                                                        (guide) =>
                                                                            guide.fair_id === chosenFair.id &&
                                                                            guide.guide_id === JSON.parse(localStorage.getItem("user")).id
                                                                    )
                                                                        ?
                                                                        <div className="fairs-fair-card-buttons">
                                                                            <CustomButton disabled className="fairs-fair-card-button special">Bu fuarda görevlisiniz!</CustomButton>
                                                                        </div>
                                                                        :
                                                                        <div className="fairs-fair-card-buttons">
                                                                            <CustomButton className="fairs-fair-card-button one" onClick={() => handleGuideRequest(chosenFair.id)}>Rehber olarak görev al</CustomButton>
                                                                        </div>
                                                                }
                                                            </>
                                                            :
                                                            role === 'admin' ?
                                                                <>
                                                                    <div className="fairs-fair-card-buttons">
                                                                        <CustomButton className="fairs-fair-card-button two" onClick={() => setEditFair(chosenFair)}>Düzenle</CustomButton>
                                                                        <CustomButton className="fairs-fair-card-button one" onClick={() => handleUpdateGuideClick()}>Rehber Ata / Değiştir</CustomButton>
                                                                    </div>
                                                                    <div className="fairs-fair-card-buttons">
                                                                        <CustomButton className="fairs-fair-card-button four" onClick={showModal3}>Onayla</CustomButton>
                                                                        <Modal
                                                                            title="Fuarı Onayla"
                                                                            visible={isModalVisible3}
                                                                            onOk={handleOk3}
                                                                            onCancel={handleCancel3}
                                                                            okText="Onayla"
                                                                            cancelText="İptal"
                                                                        >
                                                                            <p>Fuarın son halini aldığından ve onaylamak istediğinizden emin misiniz? Bu işlem sorumluya bildirilir!</p>
                                                                            <Input.TextArea
                                                                                value={feedback}
                                                                                onChange={(e) => setFeedback(e.target.value)}
                                                                                placeholder="Eklemek istediğiniz bir not var mı? (Opsiyonel)"
                                                                                rows={4}
                                                                            />
                                                                        </Modal>
                                                                        <CustomButton className="fairs-fair-card-button three" onClick={showModal4}>Reddet</CustomButton>
                                                                        <Modal
                                                                            title="Turu Onayla"
                                                                            visible={isModalVisible4}
                                                                            onOk={handleOk4}
                                                                            onCancel={handleCancel4}
                                                                            okText="Onayla"
                                                                            cancelText="İptal"
                                                                        >
                                                                            <p>Turun kalıcı olarak reddetmek istediğinizden emin misiniz? Bu işlem sorumluya bildirilir!</p>
                                                                            <Input.TextArea
                                                                                value={feedback}
                                                                                onChange={(e) => setFeedback(e.target.value)}
                                                                                placeholder="Eklemek istediğiniz bir not var mı? (Opsiyonel)"
                                                                                rows={4}
                                                                            />
                                                                        </Modal>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="fairs-fair-card-buttons">
                                                                        <CustomButton className="fairs-fair-card-button one" onClick={() => handleUpdateGuideClick()}>Rehber Ata / Değiştir</CustomButton>
                                                                    </div>
                                                                </>
                                                        }
                                                        {/* </div> */}
                                                    </>
                                                ) : ((!editedFair ? (
                                                    <>
                                                        <Tooltip title='Geri'>
                                                            <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setUpdateGuides(false)}>
                                                                <KeyboardBackspaceIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <div className="fairs-fair-card-update-guide-update-page-general">
                                                            {/* Assigned Guides */}
                                                            <div className="fair-card-update-page-assigned">
                                                                <div className="assigned-guides-cont">
                                                                    <div className="fairs-fair-card-detail-header">Atanmış Rehberler: {chosenFairAssignedGuides.filter(g => g.fair_id === chosenFair.id).length} / {Math.ceil(chosenFair.student_count)}</div>
                                                                    <div className="req-ass-content">
                                                                        {chosenFairAssignedGuides.filter(guide => guide.fair_id === chosenFair.id).map(guide => (
                                                                            <div key={guide.id} className="guide-tag assigned">
                                                                                <div>
                                                                                    <span>{guide.name}</span> / <span>{guide.guide_rating}</span> <StarIcon style={{ color: 'white' }} />
                                                                                </div>
                                                                                <div>
                                                                                    <Tooltip title='Sil'>
                                                                                        <IconButton style={{ color: 'white' }} onClick={() => handleRemoveGuideClick(guide.user_id, chosenFair.id)}>
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Requested Guides */}
                                                            <div className="fair-card-update-page-req-free">
                                                                <div className="free-req-guides">
                                                                    <div className="fairs-fair-card-detail-header">Atanabilecek Rehberler:</div>
                                                                    <div className="req-ass-content">
                                                                        {allGuides
                                                                            .filter(guide => !fairGuides.some(fairGuide => fairGuide.guide_id === guide.user_id && fairGuide.fair_id === chosenFair.id))
                                                                                .filter(g => g.isactive === true)
                                                                                .filter(guide => {
                                                                                    const dayMapping = {
                                                                                        "Monday": "Pazartesi",
                                                                                        "Tuesday": "Salı",
                                                                                        "Wednesday": "Çarşamba",
                                                                                        "Thursday": "Perşembe",
                                                                                        "Friday": "Cuma",
                                                                                        "Saturday": "Cumartesi",
                                                                                        "Sunday": "Pazar"
                                                                                    };

                                                                                    const eventDate = new Date(chosenFair.date);
                                                                                    const eventDayEnglish = eventDate.toLocaleDateString("en-US", { weekday: "long" }); // Get English day
                                                                                    const eventDayTurkish = dayMapping[eventDayEnglish]; // Convert to Turkish
                                                                                    const eventTime = eventDate.toTimeString().slice(0, 5); // Extract "HH:MM"

                                                                                    return !(guide.free_time[eventDayTurkish]?.includes(eventTime));
                                                                                })
                                                                            .map(guide => (
                                                                                <div key={guide.id} className="guide-tag available">
                                                                                    <div>
                                                                                        <span>{guide.name}</span> / <span>{guide.guide_rating}</span> <StarIcon style={{ color: 'white' }} />
                                                                                    </div>
                                                                                    <div>
                                                                                        {chosenFairAssignedGuides.filter(g => g.fair_id === chosenFair.id).length < Math.ceil(chosenFair.student_count) &&
                                                                                            <Tooltip title='Ekle'>
                                                                                                <IconButton style={{ color: 'white' }} onClick={() => handleAssignGuideClick(guide.user_id, chosenFair.id)}>
                                                                                                    <AddCircleIcon />
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>

                                                                <div className="free-req-guides">
                                                                    <div className="fairs-fair-card-detail-header">Talep Eden Rehberler:</div>
                                                                    <div className="req-ass-content">
                                                                        {chosenFairRequestedGuides.filter(guide => guide.fair_id === chosenFair.id).map(guide => (
                                                                            <div key={guide.id} className="guide-tag requested">
                                                                                <div>
                                                                                    <span>{guide.name}</span> / <span>{guide.guide_rating}</span> <StarIcon style={{ color: 'white' }} />
                                                                                </div>
                                                                                <div>
                                                                                    {chosenFairAssignedGuides.filter(g => g.fair_id === chosenFair.id).length < Math.ceil(chosenFair.student_count) &&
                                                                                        <Tooltip title='Ekle'>
                                                                                            <IconButton style={{ color: 'white' }} onClick={() => handleAssignGuideClick(guide.user_id, chosenFair.id)}>
                                                                                                <AddCircleIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip title='Geri'>
                                                            <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setEditFair(null)}>
                                                                <KeyboardBackspaceIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <div className="fairs-fair-card-detail-header">{chosenFair.high_school_name}</div>
                                                        <div className="fairs-fair-card-details">
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2" style={{ width: '300px' }}>Şehir: </div>
                                                                <Select
                                                                    placeholder={chosenFair?.city || 'Belirtilmemiş'}
                                                                    style={{ width: 300, backgroundColor: '#f8f9fa' }}
                                                                    allowClear
                                                                    variant="borderless"
                                                                    onChange={(value) => setEditFair({ ...editedFair, city: value })}
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
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu E-Posta: </div>
                                                                <Input
                                                                    className='fair-card-edit-fair-input'
                                                                    placeholder={chosenFair?.school_email || 'Belirtilmemiş'}
                                                                    variant="borderless"
                                                                    onChange={(e) =>
                                                                        setEditFair((prev) => ({
                                                                            ...prev,
                                                                            school_email: e.target.value
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu: </div>
                                                                <Input
                                                                    className='fair-card-edit-fair-input'
                                                                    placeholder={chosenFair?.teacher_name || 'Belirtilmemiş'}
                                                                    allowClear
                                                                    variant="borderless"
                                                                    onChange={(e) =>
                                                                        setEditFair((prev) => ({
                                                                            ...prev,
                                                                            teacher_name: e.target.value
                                                                        }))
                                                                    }
                                                                />

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                                <Input
                                                                    className='fair-card-edit-fair-input'
                                                                    placeholder={chosenFair?.teacher_phone_number || 'Belirtilmemiş'}
                                                                    allowClear
                                                                    variant="borderless"
                                                                    onChange={(e) =>
                                                                        setEditFair((prev) => ({
                                                                            ...prev,
                                                                            teacher_phone_number: e.target.value
                                                                        }))
                                                                    }
                                                                />

                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                                <Input
                                                                    className='fair-card-edit-fair-input'
                                                                    placeholder={chosenFair?.student_count || 'Belirtilmemiş'}
                                                                    variant="borderless"
                                                                    type="number"
                                                                    onChange={(e) =>
                                                                        setEditFair((prev) => ({
                                                                            ...prev,
                                                                            student_count: e.target.value
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Tarih:</div>
                                                                <ConfigProvider locale={trTR}>
                                                                    <DatePicker
                                                                        className='fair-card-edit-fair-input'
                                                                        type="date"
                                                                        placeholder={chosenFair?.date ? new Date(chosenFair.date).toISOString().split('T')[0] : ''}
                                                                        onChange={(date) => {
                                                                            const updatedDate = new Date(editedFair?.date || new Date());
                                                                            if (date) {
                                                                                updatedDate.setFullYear(date.year(), date.month(), date.date());
                                                                            }
                                                                            setEditFair({ ...editedFair, date: updatedDate.toISOString() });
                                                                        }}
                                                                        format="YYYY-MM-DD"
                                                                        allowClear
                                                                        variant="borderless"
                                                                    />
                                                                </ConfigProvider>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Saat:</div>
                                                                <ConfigProvider locale={trTR}>
                                                                    <TimePicker
                                                                        className='fair-card-edit-fair-input'
                                                                        placeholder={new Date(chosenFair.date).toLocaleTimeString('tr-TR', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                        format="HH:mm"
                                                                        onChange={(time) => {
                                                                            const updatedDate = new Date(editedFair?.date || new Date());
                                                                            if (time) {
                                                                                updatedDate.setHours(time.hour(), time.minute());
                                                                            }
                                                                            setEditFair({ ...editedFair, date: updatedDate.toISOString() });
                                                                        }}
                                                                        allowClear
                                                                        variant="borderless"
                                                                    />
                                                                </ConfigProvider>
                                                            </div>
                                                            <br />
                                                            <div className="fair-card-detail-format">
                                                                <div className="fair-card-detail-format2">Misaifr Notu: </div>
                                                                <Input
                                                                    className='fair-card-edit-fair-input'
                                                                    placeholder={chosenFair?.notes || 'Belirtilmemiş'}
                                                                    allowClear
                                                                    variant="borderless"
                                                                    onChange={(e) =>
                                                                        setEditFair((prev) => ({
                                                                            ...prev,
                                                                            notes: e.target.value
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div className="fairs-fair-card-buttons">
                                                            <CustomButton className="fairs-fair-card-button one" onClick={() => setEditFair(null)} >Kaydetmeden Çık</CustomButton>
                                                            <CustomButton className="fairs-fair-card-button two" onClick={handleSaveEditedFair} >Kaydet</CustomButton>
                                                        </div>
                                                    </>
                                                )
                                                )
                                                )}
                                            </div>
                                        )
                                    }
                                </TabPane>
                            }





                            {/* ONAYLANMIŞ Fuarlar*/}
                            {((role === 'admin') || (role === 'advisor') || (role === 'guide')) &&
                                <TabPane tab={<span className="fair-card-custom-tab-headers" >Onaylanmış Fuarlar</span>} key="3" >
                                    {!chosenFinalFairCard ?
                                        (upcomingFairs.length === 0 ? (
                                            <p>Yaklaşan fuar bulunmamaktadır bulunmamaktadır.</p>
                                        ) : (
                                            upcomingFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                                                <div key={index} className="fairs-fair-card" onClick={() => setChosenFinalFairCard(fair)}>
                                                    <div className="fairs-fair-header">
                                                        <div className="fairs-fair-location">
                                                            {fair.city || "Belirtilmemiş"}
                                                        </div>
                                                        <div className="fairs-fair-datetime">
                                                            <div className="fairs-fair-date">
                                                                <CalendarMonthTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}
                                                                </>
                                                            </div>
                                                            <div className="fairs-fair-time">
                                                                <AccessTimeTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleTimeString('tr-TR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-body">
                                                        <div className="fairs-fair-school">
                                                            {fair.high_school_name}
                                                        </div>
                                                        <div className="fairs-fair-details">
                                                            {fair?.student_count} Davetli
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-footer">
                                                        <div className="fairs-fair-rating">
                                                            <span>{schools.find((school) => school.school_name === fair.high_school_name)?.rate || "Belirtilmemiş"}</span> <i className="fa fa-star"></i> <StarIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )) : (
                                            <div className="fairs-fair-card non-clickable">
                                                <Tooltip title='Geri'>
                                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setChosenFinalFairCard(null)}>
                                                        <KeyboardBackspaceIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <div className="fairs-fair-card-detail-header">{chosenFinalFairCard.high_school_name}</div>
                                                <div className="fairs-fair-card-details">
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Şehir: </div>
                                                        <div>{chosenFinalFairCard?.city || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                                        <div>{chosenFinalFairCard?.school_email || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu: </div>
                                                        <div>{chosenFinalFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                        <div>{chosenFinalFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                        <div>{chosenFinalFairCard?.student_count || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Tarih:</div>
                                                        <div>
                                                            {new Date(chosenFinalFairCard.date).toLocaleDateString('tr-TR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Saat:</div>
                                                        <div>
                                                            {new Date(chosenFinalFairCard.date).toLocaleTimeString('tr-TR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Misafir Notu: </div>
                                                        <div>{chosenFinalFairCard?.notes || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumluya iletilen onay Notu: </div>
                                                        <div>{chosenFinalFairCard?.feedback || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Atanmış Rehberler: </div>
                                                        <div className="requests">
                                                            {chosenFairAssignedGuides.filter(guide => guide.fair_id === chosenFinalFairCard.id).map(guide => (
                                                                <div key={guide.id} className="guide-tag assigned">
                                                                    <div>
                                                                        <span>{guide.name}</span> / <span>{guide.guide_rating}</span> <StarIcon style={{ color: 'white' }} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </TabPane>
                            }




                            {/* BURADA HEM BTO RET HEM DE ADVISOR RETLER GÖSTERILECEK */}
                            {((role === 'admin') || (role === 'advisor') || (role === 'guide')) &&
                                <TabPane tab={<span className="fair-card-custom-tab-headers" >Reddedilen Fuarlar</span>} key="4" >
                                    {!chosenRejectedFairCard ?
                                        (rejected_fairs.length === 0 ? (
                                            <p>Reddedilen fuar bulunmamaktadır.</p>
                                        ) : (
                                            rejected_fairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                                                <div key={index} className="fairs-fair-card" onClick={() => setChosenRejectedFairCard(fair)}>
                                                    <div className="fairs-fair-location" style={{ color: 'red' }}>
                                                        {fair.confirmation === "BTO RET" ? "Advisor tarafından reddedildi" : "Yönetim tarafıdan reddedildi"}
                                                    </div>
                                                    <div className="fairs-fair-header">
                                                        <div className="fairs-fair-location">
                                                            {fair.city || "Belirtilmemiş"}
                                                        </div>
                                                        <div className="fairs-fair-datetime">
                                                            <div className="fairs-fair-date">
                                                                <CalendarMonthTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}
                                                                </>
                                                            </div>
                                                            <div className="fairs-fair-time">
                                                                <AccessTimeTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleTimeString('tr-TR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-body">
                                                        <div className="fairs-fair-school">
                                                            {fair.high_school_name}
                                                        </div>
                                                        <div className="fairs-fair-details">
                                                            {fair?.student_count} Davetli
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-footer">
                                                        <div className="fairs-fair-rating">
                                                            <span>{schools.find((school) => school.school_name === fair.high_school_name)?.rate || "Belirtilmemiş"}</span> <i className="fa fa-star"></i> <StarIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )) : (
                                            <div className="fairs-fair-card non-clickable">
                                                <Tooltip title='Geri'>
                                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setChosenRejectedFairCard(null)}>
                                                        <KeyboardBackspaceIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <div className="fairs-fair-card-detail-header">{chosenRejectedFairCard.high_school_name}</div>
                                                <div className="fairs-fair-card-details">
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Şehir: </div>
                                                        <div>{chosenRejectedFairCard?.city || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                                        <div>{chosenRejectedFairCard?.school_email || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu: </div>
                                                        <div>{chosenRejectedFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                        <div>{chosenRejectedFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                        <div>{chosenRejectedFairCard?.student_count || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Tarih:</div>
                                                        <div>
                                                            {new Date(chosenRejectedFairCard.date).toLocaleDateString('tr-TR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Saat:</div>
                                                        <div>
                                                            {new Date(chosenRejectedFairCard.date).toLocaleTimeString('tr-TR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Misafir Notu: </div>
                                                        <div>{chosenRejectedFairCard?.notes || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumluya iletilen Red Notu: </div>
                                                        <div>{chosenRejectedFairCard?.feedback || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                </div>
                                            </div>
                                        )}
                                </TabPane>
                            }





                            {/* GEÇMİŞ FUARLAR */}
                            {((role === 'admin') || (role === 'advisor') || (role === 'guide')) &&
                                <TabPane tab={<span className="fair-card-custom-tab-headers" >Geçmiş Fuarlar</span>} key="5" >
                                    {!chosenPastFairCard ?
                                        (previousFairs.length === 0 ? (
                                            <p>Geçmiş bilgisi bulunamadı.</p>
                                        ) : (
                                            previousFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                                                <div key={index} className="fairs-fair-card" onClick={() => setChosenPastFairCard(fair)}>
                                                    <div className="fairs-fair-header">
                                                        <div className="fairs-fair-location">
                                                            {fair.city || "Belirtilmemiş"}
                                                        </div>
                                                        <div className="fairs-fair-datetime">
                                                            <div className="fairs-fair-date">
                                                                <CalendarMonthTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}
                                                                </>
                                                            </div>
                                                            <div className="fairs-fair-time">
                                                                <AccessTimeTwoToneIcon />
                                                                <>
                                                                    {new Date(fair.date).toLocaleTimeString('tr-TR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-body">
                                                        <div className="fairs-fair-school">
                                                            {fair.high_school_name}
                                                        </div>
                                                        <div className="fairs-fair-details">
                                                            {fair?.student_count} Davetli
                                                        </div>
                                                    </div>

                                                    <div className="fairs-fair-footer">
                                                        <div className="fairs-fair-rating">
                                                            <span>{schools.find((school) => school.school_name === fair.high_school_name)?.rate || "Belirtilmemiş"}</span> <i className="fa fa-star"></i> <StarIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )) : (
                                            <div className="fairs-fair-card non-clickable">
                                                <Tooltip title='Geri'>
                                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setChosenPastFairCard(null)}>
                                                        <KeyboardBackspaceIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <div className="fairs-fair-card-detail-header">{chosenPastFairCard.high_school_name}</div>
                                                <div className="fairs-fair-card-details">
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Şehir: </div>
                                                        <div>{chosenPastFairCard?.city || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                                        <div>{chosenPastFairCard?.school_email || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu: </div>
                                                        <div>{chosenPastFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Sorumlu İletişim: </div>
                                                        <div>{chosenPastFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                                        <div>{chosenPastFairCard?.student_count || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Tarih:</div>
                                                        <div>
                                                            {new Date(chosenPastFairCard.date).toLocaleDateString('tr-TR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>

                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Saat:</div>
                                                        <div>
                                                            {new Date(chosenPastFairCard.date).toLocaleTimeString('tr-TR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Not: </div>
                                                        <div>{chosenPastFairCard?.notes || 'Belirtilmemiş'}</div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div className="fair-card-detail-format">
                                                        <div className="fair-card-detail-format2">Atanmış Rehberler: </div>
                                                        <div className="requests">
                                                            {chosenFairAssignedGuides.filter(guide => guide.fair_id === chosenPastFairCard.id).map(guide => (
                                                                <div key={guide.id} className="guide-tag assigned">
                                                                    <div>
                                                                        <span>{guide.name}</span> / <span>{guide.guide_rating}</span> <StarIcon style={{ color: 'white' }} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </TabPane>
                            }

                        </Tabs>
                    :
                    <>
                        HESABINIZ AKTIF DEĞİLDİR!
                        <br />
                        Danışmanlarınız ile iletişime geçiniz!
                    </>
                }
            </div >
        </>
    );
};

export default FairCard;