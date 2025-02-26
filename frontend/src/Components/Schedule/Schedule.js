import React, { useState } from "react";
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
  // "19:30",
  // "20:30",
  // "21:30",
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

const Schedule = ({ onChange }) => {
  const [schedule, setSchedule] = useState({}); // State to store clicked cells

  const toggleCell = (day, time) => {
    setSchedule((prev) => {
      const key = `${day}-${time}`;
      const updatedSchedule = { ...prev };
      if (updatedSchedule[key]) {
        delete updatedSchedule[key]; // Unmark the cell if already clicked
      } else {
        updatedSchedule[key] = true; // Mark the cell as clicked
      }

      // Format the schedule and call onChange
      const formattedSchedule = days.reduce((acc, dayName) => {
        acc[dayName] = Object.keys(updatedSchedule)
          .filter((key) => key.startsWith(dayName))
          .map((key) => key.split("-")[1]); // Extract time slots for this day
        return acc;
      }, {});

      onChange?.(formattedSchedule); // Pass the formatted schedule to the parent
      return updatedSchedule;
    });
  };

  return (
    <div className="main-container">
      <Paper
        elevation={6}
        sx={{
          // width: "90%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "16px",
          boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px",
        }}
      >
        <TableContainer>
          <Table id="schedule">
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
                    const key = `${day}-${time}`;
                    const isLocked = !!schedule[key]; // Check if the cell is marked
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
                        onClick={() => toggleCell(day, time)}
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
      </Paper>
    </div>
  );
};

export default Schedule;
