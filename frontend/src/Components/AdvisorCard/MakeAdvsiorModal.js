import React, { useState } from "react";
import { Modal, Checkbox, Button, message } from "antd";
import Axios from "../../Axios";

const MakeAdvisorModal = ({ guide, isVisible, onClose, fetchGuides }) => {
  const [selectedDays, setSelectedDays] = useState([]);

  const days = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];

  // Gün seçimini işleyin
  const handleDaySelection = (day, isChecked) => {
    if (isChecked) {
      setSelectedDays((prev) => [...prev, day]);
    } else {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    }
  };

  // Advisor oluşturma işlemi
  const handleMakeAdvisor = () => {
    if (selectedDays.length === 0) {
      message.error("Lütfen en az bir gün seçin.");
      return;
    }

    Axios.post(`/api/guides/make_advisor/${guide.id}`, { days: selectedDays })
      .then(() => {
        message.success(
          "Advisor başarıyla oluşturuldu."
        );
        fetchGuides();
        window.location.reload();
        onClose(); // Modalı kapat
      })
      .catch((error) => {
        console.error("Advisor yapılamadı:", error);
        message.error("Advisor oluşturulurken bir hata oluştu.");
      });
  };

  return (
    <Modal
      title={`Advisor Oluştur: ${guide.name}`}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          İptal
        </Button>,
        <Button key="submit" type="primary" onClick={handleMakeAdvisor}>
          Advisor Yap
        </Button>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {days.map((day) => (
          <Checkbox
            key={day}
            onChange={(e) => handleDaySelection(day, e.target.checked)}
          >
            {day}
          </Checkbox>
        ))}
      </div>
    </Modal>
  );
};

export default MakeAdvisorModal;
