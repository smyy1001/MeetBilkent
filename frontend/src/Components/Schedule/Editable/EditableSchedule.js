import React, { useEffect, useState } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/material/styles";
import Axios from "../../../Axios";
import { message } from "antd";

const timeSlots = [
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "17:30",
    "18:30",
];

const days = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
];

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

const EditableSchedule = ({ initialLockedSlots = {}, setEdit, edit, change }) => {
    const [lockedSlots, setLockedSlots] = useState(initialLockedSlots);
    const [idd] = useState(JSON.parse(localStorage.getItem("user")).id);

    const toggleCell = (day, time) => {
        setLockedSlots((prev) => {
            const updatedSlots = { ...prev };
            if (!updatedSlots[day]) {
                updatedSlots[day] = [];
            }

            // Check if the slot is already locked
            if (updatedSlots[day].includes(time)) {
                // Remove the slot
                updatedSlots[day] = updatedSlots[day].filter((slot) => slot !== time);
                if (updatedSlots[day].length === 0) {
                    delete updatedSlots[day]; // Clean up empty days
                }
            } else {
                // Add the slot
                updatedSlots[day].push(time);
            }
            return updatedSlots;
        });
    };

    useEffect(() => {
        if (change) {
            setEdit((prev) => ({
                ...prev,
                free_time: lockedSlots
            }))
        }
    }, [lockedSlots]);

    console.log("userrrrrrr", edit);


    return (
        <div style={{}}>
            {/* <Paper
                elevation={6}
                sx={{
                    width: "800px",
                    maxWidth: "800px",
                    margin: "0",
                    padding: "16px",
                    boxShadow:
                        "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px",
                }}
            > */}
                <TableContainer>
                    <Table id="editable-schedule">
                        {/* Table Head */}
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {days.map((day, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        sx={{
                                            fontWeight: "bold",
                                            borderLeft: index !== 0 ? "1px solid #e0e0e0" : "none",
                                        }}
                                    >
                                        {day.toUpperCase()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {/* Table Body */}
                        <TableBody>
                            {timeSlots.map((time, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {/* Time Slot Column */}
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        {time}
                                    </TableCell>
                                    {/* Days Columns */}
                                    {days.map((day, colIndex) => {
                                        const isLocked =
                                            lockedSlots[day]?.includes(time) ?? false; // Check if slot is locked
                                        return (
                                            <TableCell
                                                key={colIndex}
                                                align="center"
                                                sx={{
                                                    backgroundColor: isLocked ? "#f5f5f5" : "transparent",
                                                    cursor: "pointer",
                                                    borderLeft:
                                                        colIndex !== 0 ? "1px solid #e0e0e0" : "none",
                                                    "&:hover": { backgroundColor: "#e0e0e0" },
                                                }}
                                                onClick={() => {
                                                    if (change) {
                                                        toggleCell(day, time);
                                                    }
                                                }}
                                            >
                                                {isLocked ? <LockIcon fontSize="small" /> : ""}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* <div className="tours-tour-card-buttons">
                    {!change ?
                        <CustomButton className="tours-tour-card-button one" onClick={() => setChange(true)} >Düzenle</CustomButton>
                        :
                        <>
                            <CustomButton className="tours-tour-card-button two" onClick={() => { setLockedSlots(initialLockedSlots); }} >Geri</CustomButton>
                            <CustomButton className="tours-tour-card-button one" onClick={handleFreeTime}>Kaydet</CustomButton>
                        </>
                    }
                </div> */}
            {/* </Paper> */}
        </div>
    );
};

export default EditableSchedule;