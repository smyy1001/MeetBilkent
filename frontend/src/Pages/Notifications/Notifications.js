import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Notifications = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        // Fetch notifications on component load
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/notifications/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [userId]);

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const markAsSeen = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/seen`);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, seen: true } : notif
                )
            );
        } catch (error) {
            console.error("Error marking notification as seen:", error);
        }
    };

    return (
        <div>
            <Tooltip title="Notifications">
                <IconButton
                    className="nav-bar-notifications-icon"
                    onClick={handleNotificationClick}
                >
                    <Badge
                        badgeContent={
                            notifications.filter((notif) => !notif.seen).length
                        }
                        color="error"
                    >
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {notifications.length === 0 ? (
                    <MenuItem>No new notifications</MenuItem>
                ) : (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={() => markAsSeen(notif.id)}
                            style={{
                                backgroundColor: notif.seen
                                    ? "inherit"
                                    : "#f5f5f5",
                            }}
                        >
                            {notif.message}
                        </MenuItem>
                    ))
                )}
            </Menu>
        </div>
    );
};

export default Notifications;
