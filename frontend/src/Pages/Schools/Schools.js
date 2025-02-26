import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Axios from "../../Axios";
import "./Schools.css";
import SchoolCard from "../../Components/SchoolCard/SchoolCard";
import SchoolDetailCard from "../../Components/SchoolCardDetail/SchoolCardDetail";
import { Box, Button, TextField, Typography, Card } from "@mui/material";

const Schools = ({ role }) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [notes, setNotes] = useState([]); // Notes for the selected school
  const [newNote, setNewNote] = useState(""); // State for adding a new note
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activee, setActive] = useState(true);

  // Fetch all schools
  const fetchSchools = async () => {
    try {
      const response = await Axios.get("/api/schools/all/");
      setSchools(response.data);
      setFilteredSchools(response.data); // Initialize filtered schools
    } catch (err) {
      setError("Failed to fetch schools. Please try again later.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSchools().finally(() => setLoading(false));
  }, []);

  const handleSchoolClick = async (school) => {
    setSelectedSchool(school);
    fetchNotes(school.id); // Fetch notes for the selected school
  };

  const handleBack = () => {
    setSelectedSchool(null);
    setNotes([]); // Clear notes when no school is selected
  };

  const toggleSearchBar = () => {
    setSearchActive(!searchActive);
    setSearchQuery("");
    setFilteredSchools(schools); // Reset filtered schools
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = schools.filter((school) =>
      school.school_name.toLowerCase().includes(query)
    );
    setFilteredSchools(filtered);
  };

  // Fetch notes for a specific school
  const fetchNotes = async (schoolId) => {
    try {
      const response = await Axios.get(`/api/schools/${schoolId}/fetch_notes`);
      setNotes(response.data); // Populate notes for the selected school
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  // Add a new note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await Axios.post(
        `/api/schools/${selectedSchool.id}/add_note`,
        {
          content: newNote,
        }
      );
      setNotes((prevNotes) => [...prevNotes, response.data]); // Append new note
      setNewNote(""); // Clear the input
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      console.log("Deleting note:", noteId);
      await Axios.delete(`/api/schools/delete_node/notes/${noteId}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId)); // Remove note locally
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  useEffect(() => {
    if (
      role === "guide" &&
      JSON.parse(localStorage.getItem("details")).isactive === false
    ) {
      setActive(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="main-container">
      <div className={`left_container ${selectedSchool ? "with-right" : ""}`}>
        {activee ? (
          <>
            <div className="header-with-search">
              <div className="search_icon">
                <SearchIcon
                  size={20}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={toggleSearchBar}
                />
              </div>

              {searchActive ? (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Okul ara..."
                  className="search-bar"
                />
              ) : (
                <h2
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  <h2>Okullar</h2>
                </h2>
              )}
            </div>
            <hr className="custom-line" />
            {!selectedSchool ? (
              <div>
                {filteredSchools.map((school, index) => (
                  <SchoolCard
                    key={index}
                    school={school}
                    onActionClick={() => handleSchoolClick(school)}
                  />
                ))}
              </div>
            ) : (
              <SchoolDetailCard
                school={selectedSchool}
                onBack={handleBack}
                fetchSchools={fetchSchools}
              />
            )}
          </>
        ) : (
          <>
            HESABINIZ AKTIF DEĞİLDİR!
            <br />
            Danışmanlarınız ile iletişime geçiniz!
          </>
        )}
      </div>

      {selectedSchool && (
        <div className="right_container">
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginBottom: "16px" }}
          >
            {selectedSchool.school_name} Notlar
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notes.map((note) => (
              <Card
                key={note.id}
                sx={{
                  padding: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <Typography sx={{ display: "flex", alignItems: "flex-start" }}>
                  <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                    •
                  </span>
                  <span>{note.content}</span>
                </Typography>
                <Button
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleDeleteNote(note.id)}
                >
                  Sil
                </Button>
              </Card>
            ))}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Yeni not ekleyin..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0047A4", // Özel arka plan rengi
                  color: "white", // Yazı rengi
                  "&:hover": {
                    backgroundColor: "#d43c4a", // Hover (üzerine gelindiğinde) rengi
                  },
                }}
                onClick={handleAddNote}
              >
                Ekle
              </Button>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Schools;
