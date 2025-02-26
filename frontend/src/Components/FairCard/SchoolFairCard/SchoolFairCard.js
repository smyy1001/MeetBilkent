import React, { useState, useEffect, useMemo } from "react";
import { Tabs, message, Input, Select, ConfigProvider, DatePicker, TimePicker } from 'antd';
import './SchoolFairCard.css'
import { Button, Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Axios from "../../../Axios";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import StarIcon from '@mui/icons-material/Star';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import trTR from 'antd/lib/locale/tr_TR';
// import dayjs from 'dayjs';
import 'dayjs/locale/tr';

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

const SchoolFairCard = ({ pending, upcoming, rejected, previous, fetchAllFairs,
    schosenPastFairCard, ssetChosenPastFairCard, schosenPendingFairCard, ssetChosenPendingFairCard,
    schosenUpcomingFairCard, ssetChosenUpcomingFairCard, schosenRejectedFairCard, ssetChosenRejectedFairCard,
    chosenFairAssignedGuides, setCalenderSchool2, setCalenderSchool1 }) => {

    const [activeTab, setActiveTab2] = useState("1");
    const [editedFair, setEditFair] = useState(null);
    const details = useMemo(() => JSON.parse(localStorage.getItem("details")), []);

    const setActiveTab = (key) => {
        setActiveTab2(key);
        ssetChosenRejectedFairCard(null);
        ssetChosenPastFairCard(null);
        ssetChosenUpcomingFairCard(null);
        ssetChosenPendingFairCard(null);
    }


    const [previousFairs, setPreviousFairs] = useState([]);
    // const [schosenPastFairCard, ssetChosenPastFairCard] = useState(null);

    const [pendingFairs, setPendingFairs] = useState([]);
    // const [sschosenPendingFairCard, sssetChosenPendingFairCard] = useState(null);

    const [upcomingFairs, setUpcomingFairs] = useState([]);
    // const [schosenUpcomingFairCard, ssetChosenUpcomingFairCard] = useState(null);

    const [rejectedFairs, setRejectedFairs] = useState([]);
    // const [schosenRejectedFairCard, ssetChosenRejectedFairCard] = useState(null);



    // useEffect(() => {
    //     setPreviousFairs(previous.filter((p) => p.high_school_name === details.school_name));
    // }, [previous, details]);

    const filteredPreviousFairs = useMemo(
        () => previous.filter((p) => p.high_school_name === details.school_name),
        [previous, details]
    );

    useEffect(() => {
        setPreviousFairs(filteredPreviousFairs);
        setCalenderSchool1(filteredPreviousFairs);
    }, [filteredPreviousFairs]);

    // useEffect(() => {
    //     setPendingFairs(pending.filter((p) => p.high_school_name === details.school_name));
    // }, [pending, details]);

    const filteredPendingFairs = useMemo(
        () => pending.filter((p) => p.high_school_name === details.school_name),
        [pending, details]
    );

    useEffect(() => {
        setPendingFairs(filteredPendingFairs);
    }, [filteredPendingFairs]);

    // useEffect(() => {
    //     setRejectedFairs(rejected.filter((p) => p.high_school_name === details.school_name));
    // }, [rejected, details]);

    const filteredRejectedFairs = useMemo(
        () => rejected.filter((p) => p.high_school_name === details.school_name),
        [rejected, details]
    );

    useEffect(() => {
        setRejectedFairs(filteredRejectedFairs);
    }, [filteredRejectedFairs]);


    // useEffect(() => {
    //     setUpcomingFairs(upcoming.filter((p) => p.high_school_name === details.school_name));
    // }, [upcoming, details]);

    const filteredUpcomingFairs = useMemo(
        () => upcoming.filter((p) => p.high_school_name === details.school_name),
        [upcoming, details]
    );

    useEffect(() => {
        setUpcomingFairs(filteredUpcomingFairs);
        setCalenderSchool2(filteredUpcomingFairs);
    }, [filteredUpcomingFairs]);


    const handleSaveEditedFair = () => {
        // console.log("SENDED FAIR: ", editedFair);
        Axios.patch(`/api/fairs/edit/${editedFair.id}`, editedFair)
            .then((response) => {
                fetchAllFairs();
                message.success("Güncelleme başarılı!");
            })
            .catch((error) => {
                message.error("Güncelleme başarısız!");
                console.error("Error updating the fair:", error.response?.data || error.message);
            });
        ssetChosenPendingFairCard(editedFair);
        setEditFair(null);
    }

    // RATE
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };

    const handleRateSave = (id, rate) => {
        handleClose();
        rate = rate * 2;
        Axios.post(`/api/guides/rate_guide/${id}?rate=${rate}`)
            .then((response) => {
                message.succes("Değerlendirmeniz kaydedildi!");
            })
            .catch((error) => {
                // message.error("Değerlendirme kaydedilemedi!");
                console.log("Error rating the fair:", error.response?.data || error.message);
            });
        setRating(0);
    };


    return (
        <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>

            {/* PENDING REQS */}
            <TabPane tab={<span className="fair-card-custom-tab-headers" >Başvurular</span>} key="1" >
                {!schosenPendingFairCard ?
                    (pendingFairs.length === 0 ? (
                        <p>Başvuru bulunamadı.</p>
                    ) : (
                        pendingFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                            <div key={index} className="fairs-fair-card" onClick={() => ssetChosenPendingFairCard(fair)}>
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
                                        {fair?.guide_count} Davetli
                                    </div>
                                </div>

                                <div className="fairs-fair-footer">
                                    <div className="fairs-fair-rating">
                                        {/* <span>idk yet</span> <i className="fa fa-star"></i> <StarIcon /> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )) : (
                        editedFair ? (
                            <>
                                <Tooltip title='Geri'>
                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => setEditFair(null)}>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                </Tooltip>

                                <div className="fairs-fair-card-detail-header">{schosenPendingFairCard.high_school_name}</div>
                                <div className="fairs-fair-card-details">
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2" style={{ width: '300px' }}>Şehir: </div>
                                        <Select
                                            placeholder={schosenPendingFairCard?.city || 'Belirtilmemiş'}
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
                                            placeholder={schosenPendingFairCard?.school_email || 'Belirtilmemiş'}
                                            variant="borderless"
                                            allowClear
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
                                        <div className="fair-card-detail-format2">Sorumlu Öğretmen: </div>
                                        <Input
                                            className='fair-card-edit-fair-input'
                                            placeholder={schosenPendingFairCard?.teacher_name || 'Belirtilmemiş'}
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
                                        <div className="fair-card-detail-format2">Sorumlu Öğretmen İletişim: </div>
                                        <Input
                                            className='fair-card-edit-fair-input'
                                            placeholder={schosenPendingFairCard?.teacher_phone_number || 'Belirtilmemiş'}
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
                                            placeholder={schosenPendingFairCard?.guide_count || 'Belirtilmemiş'}
                                            variant="borderless"
                                            type="number"
                                            onChange={(e) =>
                                                setEditFair((prev) => ({
                                                    ...prev,
                                                    guide_count: e.target.value
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
                                                placeholder={schosenPendingFairCard?.date ? new Date(schosenPendingFairCard.date).toISOString().split('T')[0] : ''}
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
                                                placeholder={new Date(schosenPendingFairCard.date).toLocaleTimeString('tr-TR', {
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
                                        <div className="fair-card-detail-format2">Not: </div>
                                        <Input
                                            className='fair-card-edit-fair-input'
                                            placeholder={schosenPendingFairCard?.notes || 'Belirtilmemiş'}
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
                        ) : (
                            <div className="fairs-fair-card non-clickable">
                                <Tooltip title='Geri'>
                                    <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => ssetChosenPendingFairCard(null)}>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                </Tooltip>
                                <div className="fairs-fair-card-detail-header">{schosenPendingFairCard.high_school_name}</div>
                                <div className="fairs-fair-card-details">
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Şehir: </div>
                                        <div>{schosenPendingFairCard?.city || 'Belirtilmemiş'}</div>
                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                        <div>{schosenPendingFairCard?.school_email || 'Belirtilmemiş'}</div>
                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Sorumlu Öğretmen: </div>
                                        <div>{schosenPendingFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Sorumlu Öğretmen İletişim: </div>
                                        <div>{schosenPendingFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                        <div>{schosenPendingFairCard?.guide_count || 'Belirtilmemiş'}</div>
                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Tarih:</div>
                                        <div>
                                            {new Date(schosenPendingFairCard.date).toLocaleDateString('tr-TR', {
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
                                            {new Date(schosenPendingFairCard.date).toLocaleTimeString('tr-TR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <br />
                                    <div className="fair-card-detail-format">
                                        <div className="fair-card-detail-format2">Not: </div>
                                        <div>{schosenPendingFairCard?.notes || 'Belirtilmemiş'}</div>
                                    </div>
                                    <br />
                                </div>
                                <div className="fairs-fair-card-buttons">
                                    <CustomButton className="fairs-fair-card-button one" onClick={() => setEditFair(schosenPendingFairCard)}>Düzenle</CustomButton>
                                </div>
                            </div >
                        )
                    )}
            </TabPane>


            {/* UPCOMING FAIRS */}
            <TabPane tab={<span className="fair-card-custom-tab-headers" >Onaylanan Başvurular</span>} key="2" >
                {!schosenUpcomingFairCard ?
                    (upcomingFairs.length === 0 ? (
                        <p>Geçmiş bilgisi bulunamadı.</p>
                    ) : (
                        upcomingFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                            <div key={index} className="fairs-fair-card" onClick={() => ssetChosenUpcomingFairCard(fair)}>
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
                                        {fair?.guide_count} Davetli
                                    </div>
                                </div>

                                <div className="fairs-fair-footer">
                                    <div className="fairs-fair-rating">
                                        {/* <span>idk yet</span> <i className="fa fa-star"></i> <StarIcon /> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )) : (
                        <div className="fairs-fair-card non-clickable">
                            <Tooltip title='Geri'>
                                <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => ssetChosenUpcomingFairCard(null)}>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                            </Tooltip>
                            <div className="fairs-fair-card-detail-header">{schosenUpcomingFairCard.high_school_name}</div>
                            <div className="fairs-fair-card-details">
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Şehir: </div>
                                    <div>{schosenUpcomingFairCard?.city || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                    <div>{schosenUpcomingFairCard?.school_email || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen: </div>
                                    <div>{schosenUpcomingFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen İletişim: </div>
                                    <div>{schosenUpcomingFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                    <div>{schosenUpcomingFairCard?.guide_count || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Tarih:</div>
                                    <div>
                                        {new Date(schosenUpcomingFairCard.date).toLocaleDateString('tr-TR', {
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
                                        {new Date(schosenUpcomingFairCard.date).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Not: </div>
                                    <div>{schosenUpcomingFairCard?.notes || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Bilkent Onay Notu: </div>
                                    <div>{schosenUpcomingFairCard?.feedback || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                            </div>
                        </div>
                    )}
            </TabPane>


            {/* REJECTED FAIRS */}
            <TabPane tab={<span className="fair-card-custom-tab-headers" >Reddedilen Başvurular</span>} key="3" >
                {!schosenRejectedFairCard ?
                    (rejectedFairs.length === 0 ? (
                        <p>Reddedilen başvuru bulunamadı.</p>
                    ) : (
                        rejectedFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                            <div key={index} className="fairs-fair-card" onClick={() => ssetChosenRejectedFairCard(fair)}>
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
                                        {fair?.guide_count} Davetli
                                    </div>
                                </div>

                                <div className="fairs-fair-footer">
                                    <div className="fairs-fair-rating">
                                        {/* <span>idk yet</span> <i className="fa fa-star"></i> <StarIcon /> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )) : (
                        <div className="fairs-fair-card non-clickable">
                            <Tooltip title='Geri'>
                                <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => ssetChosenRejectedFairCard(null)}>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                            </Tooltip>
                            <div className="fairs-fair-card-detail-header">{schosenRejectedFairCard.high_school_name}</div>
                            <div className="fairs-fair-card-details">
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Şehir: </div>
                                    <div>{schosenRejectedFairCard?.city || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                    <div>{schosenRejectedFairCard?.school_email || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen: </div>
                                    <div>{schosenRejectedFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen İletişim: </div>
                                    <div>{schosenRejectedFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                    <div>{schosenRejectedFairCard?.guide_count || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Tarih:</div>
                                    <div>
                                        {new Date(schosenRejectedFairCard.date).toLocaleDateString('tr-TR', {
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
                                        {new Date(schosenRejectedFairCard.date).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Not: </div>
                                    <div>{schosenRejectedFairCard?.notes || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Bilkent Ret Notu: </div>
                                    <div>{schosenRejectedFairCard?.feedback || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                            </div>
                        </div>
                    )}
            </TabPane>


            {/* PAST FAIRS */}
            <TabPane tab={<span className="fair-card-custom-tab-headers" >Geçmiş Furlar</span>} key="4" >
                {!schosenPastFairCard ?
                    (previousFairs.length === 0 ? (
                        <p>Geçmiş bilgisi bulunamadı.</p>
                    ) : (
                        previousFairs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((fair, index) => (
                            <div key={index} className="fairs-fair-card" onClick={() => ssetChosenPastFairCard(fair)}>
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
                                        {fair?.guide_count} Davetli
                                    </div>
                                </div>

                                <div className="fairs-fair-footer">
                                    <div className="fairs-fair-rating">
                                        {/* <span>idk yet</span> <i className="fa fa-star"></i> <StarIcon /> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )) : (
                        <div className="fairs-fair-card non-clickable">
                            <Tooltip title='Geri'>
                                <IconButton style={{ margin: '0px', padding: '0px' }} onClick={() => ssetChosenPastFairCard(null)}>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                            </Tooltip>
                            <div className="fairs-fair-card-detail-header">{schosenPastFairCard.high_school_name}</div>
                            <div className="fairs-fair-card-details">
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Şehir: </div>
                                    <div>{schosenPastFairCard?.city || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Maili: </div>
                                    <div>{schosenPastFairCard?.school_email || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen: </div>
                                    <div>{schosenPastFairCard?.teacher_name || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Sorumlu Öğretmen İletişim: </div>
                                    <div>{schosenPastFairCard?.teacher_phone_number || 'Belirtilmemiş'}</div>

                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Davetli Sayısı: </div>
                                    <div>{schosenPastFairCard?.guide_count || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Tarih:</div>
                                    <div>
                                        {new Date(schosenPastFairCard.date).toLocaleDateString('tr-TR', {
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
                                        {new Date(schosenPastFairCard.date).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Not: </div>
                                    <div>{schosenPastFairCard?.notes || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Bilkent Onay Notu: </div>
                                    <div>{schosenPastFairCard?.feedback || 'Belirtilmemiş'}</div>
                                </div>
                                <br />
                                <br />
                                <div className="fair-card-detail-format">
                                    <div className="fair-card-detail-format2">Kampüs Rehberleri: </div>
                                    <div className="requests">
                                        {chosenFairAssignedGuides.filter(guide => guide.fair_id === schosenPastFairCard.id).map(guide => (
                                            <div key={guide.id} className="guide-tag assigned">
                                                <div>
                                                    <span>{guide.name}</span>
                                                    <Tooltip title="Puanla">
                                                        <IconButton
                                                            style={{ margin: "0px", marginLeft: "10px", padding: "0px", color: "white" }}
                                                            onClick={handleOpen}
                                                        >
                                                            <RateReviewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Modal
                                                        open={open}
                                                        onClose={handleClose}
                                                        aria-labelledby="rate-guide-modal"
                                                        aria-describedby="rate-guide-modal-description"
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: "50%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                                bgcolor: "background.paper",
                                                                borderRadius: 2,
                                                                boxShadow: 24,
                                                                p: 3,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <h3>Puan Ver</h3>
                                                            <Rating
                                                                name="half-rating"
                                                                value={rating}
                                                                precision={0.5}
                                                                onChange={handleRatingChange}
                                                                size="large"
                                                            />
                                                            <CustomButton
                                                                style={{
                                                                    marginTop: "20px",
                                                                    padding: "8px 16px",
                                                                    backgroundColor: "#1976d2",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    handleRateSave(guide.user_id, rating);
                                                                }}
                                                            >
                                                                Kaydet
                                                            </CustomButton>
                                                        </Box>
                                                    </Modal>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </TabPane>


        </Tabs>
    );
};

export default SchoolFairCard;

