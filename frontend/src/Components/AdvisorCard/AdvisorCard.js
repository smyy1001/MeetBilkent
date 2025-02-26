import React from "react";
import { Card, CardContent, Avatar, Typography } from "@mui/material";

// Günlerin İngilizce ve Türkçe isimlerini eşleştiriyoruz
const daysMap = {
  0: ["sunday", "Pazar"],
  1: ["monday", "Pazartesi"],
  2: ["tuesday", "Salı"],
  3: ["wednesday", "Çarşamba"],
  4: ["thurday", "Perşembe"],
  5: ["friday", "Cuma"],
  6: ["saturday", "Cumartesi"],
};

const AdvisorCard = ({ advisor, onActionClick }) => {
  // Bugünkü günün indeksini alıyoruz
  const todayIndex = new Date().getDay();
  // Bugünkü günün İngilizce ve Türkçe isimlerini alıyoruz
  const todayNames = daysMap[todayIndex];

  // Eğer responsible_day içinde bugünkü günün ismi varsa aktif say
  const isActiveToday = advisor.responsible_day?.some((day) =>
    todayNames.some((today) => today === day.toLowerCase())
  );
  console.log(advisor.profile_picture_url)
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3,
        borderRadius: 2,
        transition: "background-color 0.3s",
        "&:hover": {
          boxShadow: 6,
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
        },
      }}
      onClick={onActionClick}
    >
      <Avatar
        
        src= {advisor.profile_picture_url ||  "https://via.placeholder.com/100"}
        alt={`${advisor.name}'s profile`}
        sx={{ width: 80, height: 80, marginRight: 2 }}
      />
      <CardContent sx={{ flexGrow: 1, padding: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h9" fontWeight="bold" marginRight="6px">
            {advisor.name}
          </Typography>
          <Typography variant="h9" fontStyle="italic">
            {advisor.department || "No Deparment"}
          </Typography>
        </div>
        <Typography>Danışman</Typography>
        <Typography
          variant="body2"
          sx={{
            color: isActiveToday ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {isActiveToday ? "Aktif" : "Meşgul"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {advisor.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdvisorCard;
