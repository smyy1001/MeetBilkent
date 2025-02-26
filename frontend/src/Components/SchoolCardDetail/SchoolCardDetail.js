import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { message } from "antd";
import Axios from "../../Axios";
import StarRateIcon from "@mui/icons-material/StarRate";

const SchoolDetailCard = ({ school, onBack, fetchSchools }) => {
  const [editedSchool, setEditedSchool] = useState({ ...school });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await Axios.put(`/api/schools/edit/${school.id}`, editedSchool);
      message.success("Okul bilgileri başarıyla güncellendi!");
      setIsEditing(false);
      fetchSchools();
    } catch (error) {
      console.error("Okul bilgileri güncellenemedi:", error);
      message.error("Okul bilgileri güncellenemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 2 }}>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button
          variant="text"
          onClick={onBack}
          sx={{ fontSize: "1rem", color: "text.primary" }}
        >
          <ArrowBackIcon sx={{ fontSize: 30 }} />
        </Button>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        marginBottom={3}
      >
        <Avatar
          src= {school.profile_picture_url ||  "https://via.placeholder.com/100"}
          alt={`${school.name} Profile`}
          sx={{ width: 80, height: 80, marginBottom: 1 }}
        />
        <Typography variant="h6" fontWeight="bold">
          {school.school_name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {school.email}
        </Typography>
      </Box>

      <Divider
        sx={{
          marginBottom: 2,
          borderBottomWidth: "2px", // Adjust the thickness here
          borderColor: "rgba(0, 0, 0, 0.40)", // Optional: Customize the divider color
        }}
      />

      <CardContent>
        <Box sx={{ lineHeight: 1.6 }}>
          <Typography variant="body1" gutterBottom>
            <strong>E-Posta:</strong>{" "}
            {isEditing ? (
              <TextField
                fullWidth
                value={editedSchool.email}
                onChange={(e) =>
                  setEditedSchool({ ...editedSchool, email: e.target.value })
                }
              />
            ) : (
              school.email
            )}
          </Typography>
          <Box display="flex">
            <Typography variant="body1" gutterBottom>
              <strong>Puan:</strong>
            </Typography>
            <Typography marginLeft="2px">
              {school.rate || "Değerlendirilmedi"}
            </Typography>
            <StarRateIcon sx={{ fontSize: "16px", marginTop: "3px" }} />
          </Box>
          <Typography variant="body1" gutterBottom>
            <strong>Yetkili Kişi:</strong>{" "}
            {isEditing ? (
              <TextField
                fullWidth
                value={editedSchool.username}
                onChange={(e) =>
                  setEditedSchool({
                    ...editedSchool,
                    username: e.target.value,
                  })
                }
              />
            ) : (
              school.username
            )}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Yetkili Telefon:</strong>{" "}
            {isEditing ? (
              <TextField
                fullWidth
                value={editedSchool.user_phone}
                onChange={(e) =>
                  setEditedSchool({ ...editedSchool, phone: e.target.value })
                }
              />
            ) : (
              school.user_phone
            )}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Yetkilinin Okuldaki Rolü:</strong>{" "}
            {isEditing ? (
              <TextField
                fullWidth
                value={editedSchool.user_role}
                onChange={(e) =>
                  setEditedSchool({
                    ...editedSchool,
                    user_role: e.target.value,
                  })
                }
              />
            ) : (
              school.user_role
            )}
          </Typography>
        </Box>
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: "16px" }}
          >
            Kaydet
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolDetailCard;
