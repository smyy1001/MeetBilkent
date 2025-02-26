import React from "react";
import { Card, CardContent, Box, Avatar, Typography } from "@mui/material";
import Sparkles from "../Sparkle/Sparkles";

const GuideCard = ({ guide, onActionClick, isMaxTourCount }) => {
  // Get the user's role from local storage
  const userRole = localStorage.getItem("role");

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3, // Fixed shadow level
        borderRadius: 2,
        transition: "background-color 0.3s",
        "&:hover": {
          boxShadow: 6, // Deeper shadow on hover
          backgroundColor: "#f5f5f5", // Gray background on hover
          cursor: "pointer",
        },
      }}
      onClick={onActionClick} // Make the card clickable
    >
      {/* Left Section: Avatar and Info */}
      <Avatar
        src= {guide.profile_picture_url  ||  "https://via.placeholder.com/100"} // Placeholder image
        alt={`${guide.name}'s profile`}
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
            {isMaxTourCount ? (
              <Sparkles color="gold">{guide.name}</Sparkles>
            ) : (
              guide.name
            )}
          </Typography>
          <Typography variant="h9" fontStyle="italic">
            {guide.department || "Bilinmiyor"}
          </Typography>
        </div>

        <Typography>Rehber</Typography>
        <Typography variant="body2" color="textSecondary">
          {guide.email}
        </Typography>

        {/* Conditionally render the rating only if the user's role is not 'guides' */}
        {userRole !== "guide" && (
          <Typography variant="body2" color="textSecondary">
            <strong>Rating:</strong> {guide.guide_rating} ⭐
          </Typography>
        )}
      </CardContent>

      {/* Right Section: Action and Status */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      ></Box>
    </Card>
  );
};

export default GuideCard;
