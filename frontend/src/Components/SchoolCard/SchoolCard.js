import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SchoolCard = ({ school, onActionClick }) => (
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
      src= {school.profile_picture_url}
      alt={`${school.name}'s profile`}
      sx={{ width: 80, height: 80, marginRight: 2 }}
    />
    <CardContent sx={{ flexGrow: 1, padding: 0 }}>
      <div className="font-bold">
        <h5>{school.school_name}</h5>
      </div>
      <Box
        display="flex"
        alignItems="center"
        sx={{ marginTop: "8px" }}
        color="text.secondary"
      >
        <LocationOnIcon sx={{ fontSize: 16, marginRight: 0.1 }} />
        <Typography variant="body2" color="textSecondary">
          {school.city}
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        sx={{ marginTop: "7px" }}
        color="text.secondary"
      >
        {school.rate ? (
          <>
            <Typography variant="body2" sx={{ marginRight: "1px" }}>
              {school.rate}
            </Typography>
            <StarIcon sx={{ fontSize: "16px", color: "#FFD700" }} />{" "}
            {/* Gold star */}
          </>
        ) : (
          <Typography variant="body2">Değerlendirilmedi</Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default SchoolCard;
