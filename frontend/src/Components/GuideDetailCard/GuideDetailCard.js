import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Collapse,
  Modal,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { message } from "antd";
import Axios from "../../Axios";
import MakeAdvisorModal from "../AdvisorCard/MakeAdvsiorModal";

const GuideDetailCard = ({
  role,
  guide,
  setSelectedGuide,
  fetchGuides,
  onBack,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editedGuide, setEditedGuide] = useState({ ...guide });
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActivateGuide = async () => {
    try {
      await Axios.post(`/api/guides/activate_guide/${guide.id}`);
      message.success("Rehber başarıyla aktif edildi!");
      fetchGuides(); // Rehber listesini güncelle
      setSelectedGuide(null); // Seçili rehberi sıfırla
      window.location.reload();
    } catch (error) {
      console.error("Rehber aktif edilemedi:", error);
      message.error("Rehber aktif edilemedi. Lütfen tekrar deneyin.");
    }
  };
  const handleDeleteAccount = async () => {
    try {
      await Axios.delete(`/api/guides/delete/${guide.id}`);
      message.success("Rehber başarıyla silindi!");
      fetchGuides(); // Refresh guide list
      setSelectedGuide(null); // Deselect the current guide
      setConfirmModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error("Hesap silinemedi:", error);
      message.error("Hesap silinemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleRejectGuide = async () => {
    try {
      await Axios.delete(`/api/guides/delete/${guide.id}`);
      message.success("Rehber başarıyla silindi!");
      fetchGuides(); // Rehber listesini güncelle
      setSelectedGuide(null); // Seçili rehberi sıfırla
    } catch (error) {
      console.error("Rehber silinemedi:", error);
      message.error("Rehber silinemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleNotesSave = async () => {
    try {
      await Axios.post(`/api/guides/edit/${guide.id}`, {
        notes: editedGuide.notes,
      });
      message.success(
        "Notlar başarıyla güncellendi!"
      );
      window.location.reload();
      setIsEditingNotes(false);
      fetchGuides(); // Refresh the guide list
    } catch (error) {
      console.error("Notlar güncellenemedi:", error);
      message.error("Notlar güncellenemedi. Lütfen tekrar deneyin.");
    }
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
          {role !== "guide" && (
            <IconButton onClick={handleMenuClick}>
              <MoreHorizIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )}

          {role !== "guide" && (
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
                  setModalOpen(true);
                  handleMenuClose();
                }}
              >
                Danışman Yap
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setConfirmModalOpen(true);
                  handleMenuClose();
                }}
              >
                Hesabını Sil
              </MenuItem>
            </Menu>
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          marginBottom={3}
        >
          <Avatar
            src= {guide.profile_picture_url  ||  "https://via.placeholder.com/100"}
            alt={`${guide.name} Profile`}
            sx={{
              width: 80,
              height: 80,
              marginBottom: 1,
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {guide.name}{" "}
            <Typography component="span" variant="body2" color="textSecondary">
              Rehber
            </Typography>
          </Typography>

          {guide.isactive ? (
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                color: guide.isactive ? "green" : "red",
                fontWeight: "bold",
                justifyContent: "center",
              }}
            >
              {guide.isactive ? "Müsait" : "Meşgul"}
            </Typography>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              marginTop={2}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleActivateGuide}
              >
                Aktif Et
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleRejectGuide}
              >
                Reddet
              </Button>
            </Box>
          )}
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
              <strong>E-Posta:</strong> {guide.username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Bölümü:</strong> {guide.department || "-"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tur Sayısı:</strong> {guide.tour_count || 0}
            </Typography>
            {role !== "guide" && (
              <Typography variant="body1" gutterBottom>
                <strong>Rating:</strong> {guide.guide_rating} ⭐
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>Cep Telefonu:</strong> {guide.phone || "-"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Iban:</strong> {guide.iban_no|| "-"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Notlar:</strong>
            </Typography>
            {isEditingNotes ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedGuide.notes || ""}
                onChange={(e) =>
                  setEditedGuide((prev) => ({
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
                }}
              >
                {guide.notes || "Herhangi bir not yok. Tıklayarak ekleyin."}
              </Typography>
            )}
            <Button
              variant="text"
              onClick={() => setShowMore((prev) => !prev)}
              sx={{ marginTop: 2 }}
            >
              {showMore ? "Daha Az Göster" : "Daha Fazlası"}
              {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            <Collapse in={showMore}>
              <Box
                sx={{ marginTop: 2, lineHeight: 1.6, color: "text.secondary" }}
              >
                <Typography variant="body1" gutterBottom>
                  <strong>Acil Durum Ulaşılacak Kişi:</strong>{" "}
                  {guide.emergency_contact_name || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Acil Durum Ulaşılacak Kişi Numarası:</strong>{" "}
                  {guide.emergency_contact_phone || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Başlangıç Tarihi</strong>{" "}
                  {guide.start_date
                    ? new Date(guide.start_date).toLocaleDateString()
                    : "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Puantaj:</strong> {guide.puantaj || 0}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
      {/* Confirmation Modal */}
      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="confirmation-modal" variant="h6">
            Emin misiniz?
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Bu rehberi silmek istediğinize emin misiniz?
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              sx={{ mr: 2 }}
            >
              Sil
            </Button>
            <Button
              variant="outlined"
              onClick={() => setConfirmModalOpen(false)}
            >
              İptal
            </Button>
          </Box>
        </Box>
      </Modal>
      <MakeAdvisorModal
        guide={guide}
        isVisible={modalOpen}
        onClose={() => setModalOpen(false)}
        fetchGuides={fetchGuides}
      />
    </>
  );
};

export default GuideDetailCard;
