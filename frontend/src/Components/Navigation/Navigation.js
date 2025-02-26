import React, { useState,useEffect } from "react";
import { Typography, Badge, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"; 

import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../../AuthProvider";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';
import CollectionsIcon from '@mui/icons-material/Collections';
import Person2Icon from '@mui/icons-material/Person2';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css'
import Axios from "../../Axios";

const mockData = [
    {
      "id": 120,
      "user_id": "3f34e28c-df8f-4b3f-8757-88b57fe6f6ae",
      "title": "Yeni Bir Bildirim",
      "message": "Sisteme başarılı bir şekilde giriş yaptınız.",
      "seen": false,
      "created_at": "2024-12-14T10:00:00Z"
    },
    {
      "id": 121,
      "user_id": "3f34e28c-df8f-4b3f-8757-88b57fe6f6ae",
      "title": "Randevu Onayı",
      "message": "Yaklaşan randevunuz onaylandı. Lütfen zamanında geliniz.",
      "seen": false,
      "created_at": "2024-12-13T15:00:00Z"
    },
    {
      "id": 123,
      "user_id": "cb8d21b3-d1b2-46ae-8d5e-f07c5ffeb4e9",
      "title": "Hesap Aktivasyonu",
      "message": "Hesabınız başarıyla aktive edilmiştir. Şimdi giriş yapabilirsiniz.",
      "seen": true,
      "created_at": "2024-12-12T08:30:00Z"
    },
    {
      "id": 124,
      "user_id": "cb8d21b3-d1b2-46ae-8d5e-f07c5ffeb4e9",
      "title": "Yeni Mesaj",
      "message": "Size yeni bir mesaj gönderildi. Mesajınızı kontrol ediniz.",
      "seen": false,
      "created_at": "2024-12-11T17:45:00Z"
    },
    {
      "id": 125,
      "user_id": "abc56d23-1234-45d6-8f20-547d44b1f9ab",
      "title": "Sistem Bakımı",
      "message": "Bu gece sistem bakımı yapılacaktır. Lütfen verilerinizi yedekleyin.",
      "seen": true,
      "created_at": "2024-12-10T13:00:00Z"
    },
    {
      "id": 126,
      "user_id": "abc56d23-1234-45d6-8f20-547d44b1f9ab",
      "title": "Duyuru: Yeni Özellik",
      "message": "Yeni özelliklerimizle tanışın! Artık daha hızlı işlem yapabilirsiniz.",
      "seen": false,
      "created_at": "2024-12-09T14:20:00Z"
    },
    {
      "id": 127,
      "user_id": "3f34e28c-df8f-4b3f-8757-88b57fe6f6ae",
      "title": "Uyarı: Gecikme",
      "message": "Başvurunuzda bir gecikme yaşanıyor. Lütfen sabırlı olun.",
      "seen": true,
      "created_at": "2024-12-08T09:00:00Z"
    },
    {
      "id": 128,
      "user_id": "cb8d21b3-d1b2-46ae-8d5e-f07c5ffeb4e9",
      "title": "Yeni Görev",
      "message": "Yeni bir görev atandı. Lütfen görevlerinizi kontrol ediniz.",
      "seen": false,
      "created_at": "2024-12-07T18:30:00Z"
    }
  ]
  

  const StyledMenu = styled(Menu)({
    "& .MuiPaper-root": {
      backgroundColor: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "8px", // Make the menu corners rounded
      maxHeight: "300px", // Set the max height for the dropdown
      overflowY: "auto", // Enable vertical scrolling
      scrollbarWidth: "thin", // For Firefox (optional)
      "&::-webkit-scrollbar": {
        width: "8px", // For Chrome, Edge, Safari
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      },
      padding: "8px", // Add some padding inside the menu
    },
  });
  
  const StyledMenuItem = styled(MenuItem)({
    padding: "20px 16px", // Increase padding for a larger clickable area
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align text to the left
    borderBottom: "1px solid #f0f0f0", // Add a subtle border between items
    "&:last-child": {
      borderBottom: "none", // Remove border for the last item
    },
    "&:hover": {
      backgroundColor: "#f0f0f0", // Add a hover effect
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


const Navigation = ({ role }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const open = Boolean(anchorEl);
    
    const [isNotifExists,setIsNotificationExists] = useState(false);
  
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        console.log("user:",user);
        console.log("user_id:",user.id);
        const response = await Axios.get(`/api/notifications/get/${user.id}`);
        console.log("response.data:",response.data)
        
        console.log("response.data:",response.data)
        

        if (response.data.length === 0){
            setNotifications([]);
        }
        else{
            setNotifications(response.data);
        }
        
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    
  
    /* useEffect(() => {
      if (isAuthenticated()) {
        fetchNotifications(user.id); // Fetch notifications when component mounts
      }
      else{
        setNotifications(mockData);
      }
      

    }, [isAuthenticated]); */

    useEffect(() => {
        if (isAuthenticated()) {
          const fetchAndUpdateNotifications = () => {
            fetchNotifications(); // Pass the user.id parameter
          };
      
          fetchAndUpdateNotifications(); // Fetch immediately when the component mounts
          const interval = setInterval(fetchAndUpdateNotifications, 20000); // Poll every 20 seconds
      
          return () => clearInterval(interval); // Cleanup interval on unmount
        } else {
          setNotifications(mockData); // Provide mock data if not authenticated
        }
      }, [isAuthenticated]); 
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleNotificationClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleNotificationItemClick = async (notification) => {
      setSelectedNotification(notification);
      setNotifications(
        notifications.map(n => n.id === notification.id ? { ...n, seen: true } : n)
      );
      try{
        const response = await Axios.patch(`api/notifications/mark_seen/${notification.id}`);
        console.log("seen update successfull")
        }
        catch(e){
            console.log("error:", e.message)
        }
      handleClose();
    };
  
    const handleCloseNotificationDialog = () => {
      setSelectedNotification(null);
    };    

    return (
        <>
            {isAuthenticated() ? (
                <>
                    <Tooltip title="Bildirimler">
                         <IconButton className='nav-bar-notifications-icon' onClick={handleNotificationClick}>

                                        <Badge
                                    badgeContent={notifications.filter((n) => !n.seen).length} // Count unseen notifications
                                    color="error" // Red color for the badge
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    >
                                    <NotificationsIcon style={{ fontSize: "30px", cursor: "pointer" }} />
                                </Badge>
                        </IconButton> 


                        

                    </Tooltip>

                    <div className="nav-bar-tabs">
                        {role === "school" ? (
                            <>
                                <Tooltip title="Tüm Turlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/tours' ? 'selected' : ''}`} onClick={() => navigate('/tours')}>
                                        Turlarım
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Tüm Fuarlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/fairs' ? 'selected' : ''}`} onClick={() => navigate('/fairs')}>
                                        Fuarlarım
                                    </CustomButton>
                                </Tooltip>


                                <Tooltip title="Başvuru Yap">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/apply' ? 'selected' : ''}`} onClick={() => navigate('/apply')}>
                                        Başvur
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Profil Sayfası">
                                    <CustomButton className={`nav-bar-tab-button2 ${location.pathname === '/profile' ? 'selected2' : ''}`} onClick={() => navigate("/profile")}>
                                        Profilim
                                    </CustomButton>
                                </Tooltip>

                            </>



                        ) : role === "guide" ? (

                            <>
                                <Tooltip title="Tüm Turlar">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/tours' ? 'selected' : ''}`} onClick={() => navigate('/tours')}>
                                        Turlar
                                    </CustomButton>
                                </Tooltip>
                                <Tooltip title="Tüm Fuarlar">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/fairs' ? 'selected' : ''}`} onClick={() => navigate('/fairs')}>
                                        Fuarlar
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Tüm Okullar">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/schools' ? 'selected' : ''}`} onClick={() => navigate('/schools')}>
                                        Okullar
                                    </CustomButton>
                                </Tooltip>


                                <Tooltip title="Tüm Rehberler Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/guides' ? 'selected' : ''}`} onClick={() => navigate('/guides')}>
                                        Ekip
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Profil Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/profile' ? 'selected' : ''}`} onClick={() => navigate("/profile")}>
                                        {/* <Person2Icon style={{ marginRight: "5px" }} /> */}
                                        Profilim
                                    </CustomButton>
                                </Tooltip>

                            </>

                            // Adminse
                        ) : (role === "admin" || role === "advisor") ? (

                            <>
                                <Tooltip title="Tüm Turlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/tours' ? 'selected' : ''}`} onClick={() => navigate('/tours')}>
                                        Turlar
                                    </CustomButton>
                                </Tooltip>
                                <Tooltip title="Tüm Fuarlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/fairs' ? 'selected' : ''}`} onClick={() => navigate('/fairs')}>
                                        Fuarlar
                                    </CustomButton>
                                </Tooltip>
                                <Tooltip title="Tüm Rehberler Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/guides' ? 'selected' : ''}`} onClick={() => navigate('/guides')}>
                                        Ekip
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Tüm Okullar">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/schools' ? 'selected' : ''}`} onClick={() => navigate('/schools')}>
                                        Okullar
                                    </CustomButton>
                                </Tooltip>

                                {role === 'advisor' &&
                                    <Tooltip title="Profil Sayfası">
                                        <CustomButton className={`nav-bar-tab-button ${location.pathname === '/profile' ? 'selected' : ''}`} onClick={() => navigate("/profile")}>
                                            {/* <Person2Icon style={{ marginRight: "5px" }} /> */}
                                            Profilim
                                        </CustomButton>
                                    </Tooltip>
                                }


                            </>
                        ) : (
                            <>
                                <Tooltip title="Tüm Turlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/tours' ? 'selected' : ''}`} onClick={() => navigate('/tours')}>
                                        Turlar
                                    </CustomButton>
                                </Tooltip>
                                <Tooltip title="Tüm Fuarlar Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/fairs' ? 'selected' : ''}`} onClick={() => navigate('/fairs')}>
                                        Fuarlar
                                    </CustomButton>
                                </Tooltip>
                                <Tooltip title="Tüm Rehberler Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/guides' ? 'selected' : ''}`} onClick={() => navigate('/guides')}>
                                        Ekip
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Tüm Okullar">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/schools' ? 'selected' : ''}`} onClick={() => navigate('/schools')}>
                                        Okullar
                                    </CustomButton>
                                </Tooltip>

                                <Tooltip title="Profil Sayfası">
                                    <CustomButton className={`nav-bar-tab-button ${location.pathname === '/profile' ? 'selected' : ''}`} onClick={() => navigate("/profile")}>
                                        {/* <Person2Icon style={{ marginRight: "5px" }} /> */}
                                        Profilim
                                    </CustomButton>
                                </Tooltip>

                            </>
                        )}
                    </div>


                    <Tooltip title="Çıkış Yap">
                        <CustomButton className="nav-bar-logout-button" onClick={logout}>
                            Çıkış Yap <ArrowRightAltIcon style={{ marginLeft: '10px' }} />
                        </CustomButton>
                    </Tooltip>


                    <StyledMenu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        >
                             {/* Styled Typography for the title "Bildirimler" */}
                            {notifications.length === 0 && <Typography
                                textAlign="center"
                                variant="h6"  // Changed variant to 'h6' to make it stand out
                                 // Used 'textPrimary' for a darker color
                                sx={{ padding: "5px 0",fontSize: "0.9rem" }} // Additional padding and size
                            >
                                Henüz bildiriminiz yok.
                            </Typography>}
                       
                        {notifications.length !== 0 && notifications.map((notification) => (
                            <StyledMenuItem
                            key={notification.id}
                            onClick={() => handleNotificationItemClick(notification)}
                            style={{
                                backgroundColor: notification.seen ? "#f9f9f9" : "white", // Mark as read
                                fontWeight: notification.seen ? "normal" : "bold",
                            }}
                            >
                            <div>
                                <div> <bold style={{ fontSize: "1rem", color: "#333" }}>
                                {notification.title}
                                </bold></div>
                                
                                <div> 
                                    <span style={{ fontSize: "0.85rem", color: "#666" }}>
                                    {new Date(notification.created_at).toLocaleString()}
                                    </span>
                                </div>
                               
                            </div>
                            </StyledMenuItem>
                        ))}
                        </StyledMenu>;


                </>
            ) : (
                (location.pathname !== '/login' && location.pathname !== '/register') && (
                    <Tooltip title="Giriş Yap">
                        <CustomButton className="nav-bar-logout-button" onClick={() => navigate('/login')}>
                            Giriş Yap <ArrowRightAltIcon style={{ marginLeft: '10px' }} />
                        </CustomButton>
                    </Tooltip>
                )
            )}
             {/* Detailed Notification Dialog */}
      {selectedNotification && (
        <Dialog open={Boolean(selectedNotification)} onClose={handleCloseNotificationDialog}>
          <DialogTitle>{selectedNotification.title}</DialogTitle>
          <DialogContent>
            <p>{selectedNotification.message}</p>
            <p><strong>Tarih:</strong> {new Date(selectedNotification.created_at).toLocaleString()}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNotificationDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
            
        </>
    );
};

export default Navigation;

