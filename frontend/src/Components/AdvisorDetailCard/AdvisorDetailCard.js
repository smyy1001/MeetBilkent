import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { message } from "antd";
import Axios from "../../Axios";

const AdvisorDetailCard = ({
  advisor,
  setSelectedAdvisor,
  fetchAdvisors,
  onBack,
}) => {
  const daysMap = {
    0: ["sunday", "Pazar"],
    1: ["monday", "Pazartesi"],
    2: ["tuesday", "Salı"],
    3: ["wednesday", "Çarşamba"],
    4: ["thurday", "Perşembe"],
    5: ["friday", "Cuma"],
    6: ["saturday", "Cumartesi"],
  };
  // Bugünkü günün indeksini alıyoruz
  const todayIndex = new Date().getDay();
  // Bugünkü günün İngilizce ve Türkçe isimlerini alıyoruz
  const todayNames = daysMap[todayIndex];

  // Eğer responsible_day içinde bugünkü günün ismi varsa aktif say
  const isActiveToday = advisor.responsible_day?.some((day) =>
    todayNames.some((today) => today === day.toLowerCase())
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedAdvisor, setEditedAdvisor] = useState({ ...advisor });
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the confirmation modal
  const open = Boolean(anchorEl);

  // Fetch role from localStorage
  const role = localStorage.getItem("role");

  const handleNotesSave = async () => {
    console.log("editedAdvisor", editedAdvisor);
    try {
      await Axios.post(`/api/advisors/edit/${advisor.id}`, {
        notes: editedAdvisor.notes,
      });
      setSelectedAdvisor((prev) => ({
        ...prev,
        notes: editedAdvisor.notes,
      }));
      message.success("Notlar başarıyla güncellendi!");
      setIsEditingNotes(false);
      fetchAdvisors();
    } catch (error) {
      console.error("Notlar güncellenemedi:", error);
      message.error("Notlar güncellenemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await Axios.delete(`/api/advisors/delete/${advisor.id}`);
      console.log(advisor.id);
      message.success("Hesap Silindi");
      fetchAdvisors();
      setSelectedAdvisor(null);
    } catch (error) {
      console.error("Hesap silinemedi:", error);
      message.error("Hesap silinemedi. Lütfen tekrar deneyin.");
    }
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <Card
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "#fff",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Button
            variant="text"
            onClick={onBack}
            sx={{ fontSize: "1rem", color: "text.primary" }}
          >
            <ArrowBackIcon sx={{ fontSize: 30 }} />
          </Button>

          {/* Conditionally render the three dots menu for non-guide roles */}
          {role !== "guide" && (
            <IconButton onClick={handleMenuClick}>
              <MoreHorizIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                setIsModalOpen(true); // Open confirmation modal
                handleMenuClose();
              }}
            >
              Hesabı Sil
            </MenuItem>
          </Menu>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          marginBottom={3}
        >
          <Avatar
            src= {advisor.profile_picture_url  ||  "https://via.placeholder.com/100"}
            alt={`${advisor.name} Profile`}
            sx={{
              width: 80,
              height: 80,
              marginBottom: 1,
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {advisor.name}{" "}
            <Typography component="span" variant="body2" color="textSecondary">
              Danışman
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isActiveToday ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isActiveToday ? "Aktif" : "Meşgul"}
          </Typography>
        </Box>

        <Divider
          sx={{
            marginBottom: 2,
            borderBottomWidth: 2,
            borderColor: "rgba(0, 0, 0, 0.8)",
          }}
        />

        <CardContent>
          <Box sx={{ lineHeight: 1.6, color: "text.secondary" }}>
            <Typography variant="body1" gutterBottom>
              <strong>E-Posta:</strong> {advisor.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Cep Telefonu:</strong> {advisor.phone || "-"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Iban:</strong> {advisor.iban_no || "-"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Görev Günleri:</strong>
              {advisor.responsible_day
                  ?.map((day) => {
                    const matchedDay = Object.values(daysMap).find(
                      ([eng]) => eng.toLowerCase() === day.toLowerCase()
                    );
                    return matchedDay ? matchedDay[1] : day; // Türkçe'yi al
                  })
                  .join(", ") || "Belirtilmemiş"
              }

            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Departman:</strong>{" "}
              {advisor.department || "Belirtilmemiş"}
            </Typography>

            {/* Conditionally render notes for non-guide roles */}
            {role !== "guide" && (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Notlar:</strong>
                </Typography>
                {isEditingNotes ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={editedAdvisor.notes || ""}
                    onChange={(e) =>
                      setEditedAdvisor((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    onBlur={handleNotesSave}
                    variant="outlined"
                    placeholder="Notları düzenlemek için yazın..."
                  />
                ) : (
                  <Typography
                    variant="body1"
                    onClick={() => setIsEditingNotes(true)}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      padding: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      maxHeight: "100px",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {advisor.notes ||
                      "Herhangi bir not yok. Tıklayarak ekleyin."}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            id="confirmation-modal-title"
            variant="h6"
            sx={{ marginBottom: 2, textAlign: "center" }}
          >
            Bu kullanıcıyı silmek istediğinize emin misiniz?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Evet
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsModalOpen(false)}
            >
              Hayır
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AdvisorDetailCard;
