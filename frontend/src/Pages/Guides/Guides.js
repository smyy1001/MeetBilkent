import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Axios from "../../Axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css"; // Import CSS for the calendar
import "./Guides.css";
import Guide from "../../Components/GuideCard/GuideCard";
import GuideDetailCard from "../../Components/GuideDetailCard/GuideDetailCard";
import GuideTourCard from "../../Components/GuideTourCard/GuideTourCard";
import AdvisorCard from "../../Components/AdvisorCard/AdvisorCard";
import AdvisorDetailCard from "../../Components/AdvisorDetailCard/AdvisorDetailCard";
import GradingIcon from "@mui/icons-material/Grading"; // İkon eklendi

const Guides = ({ role }) => {
  const [inactiveGuides, setInactiveGuides] = useState([]); // Aktif olmayan rehberler
  const [showInactiveGuides, setShowInactiveGuides] = useState(false); // Sağ tarafta göstermek için
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [tours, setTours] = useState([]);
  const [guideTours, setGuideTours] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null); // General state for both Guide and Advisor
  const [selectedGuideTours, setSelectedGuideTours] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advisors, setAdvisors] = useState([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [maxTourCount, setMaxTourCount] = useState(0); // En yüksek tur sayısını saklamak için
  const [filterType, setFilterType] = useState("all"); // "all", "guides", "advisors"
  const [activee, setActive] = useState(true);

  const fetchGuides = async () => {
    try {
      const response = await Axios.get("/api/guides/all");
      const guidesData = response.data;

      // Sadece aktif rehberleri filtrele
      const activeGuides = guidesData.filter((guide) => guide.isactive);

      // Find the maximum tour_count
      const maxTour = Math.max(
        ...activeGuides.map((guide) => guide.tour_count)
      );
      setMaxTourCount(maxTour);
      setGuides(activeGuides);
      setFilteredGuides(activeGuides); // Sadece aktif rehberleri göster
    } catch (err) {
      console.error("Failed to fetch guides. Please try again later.");
    }
  };

  const fetchInactiveGuides = async () => {
    try {
      const response = await Axios.get("/api/guides/all");
      const inactive = response.data.filter((guide) => !guide.isactive);
      setInactiveGuides(inactive);
    } catch (err) {
      console.error("Failed to fetch inactive guides:", err);
    }
  };
  const handleGradingIconClick = () => {
    setShowInactiveGuides(!showInactiveGuides);
    fetchInactiveGuides(); // İkon tıklandığında aktif olmayan rehberleri getir
  };

  useEffect(() => {
    if (
      role === "guide" &&
      JSON.parse(localStorage.getItem("details")).isactive === false
    ) {
      setActive(false);
    }
  }, []);

  const fetchAdvisors = async () => {
    try {
      const response = await Axios.get("/api/advisors/all");
      setAdvisors(response.data);
      setFilteredAdvisors(response.data);
    } catch (err) {
      console.error("Failed to fetch advisors.", err);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await Axios.get("/api/tours/all");
      setTours(response.data);
    } catch (err) {
      console.error("Failed to fetch tours.", err);
    }
  };

  const fetchGuideTours = async () => {
    try {
      const response = await Axios.get("/api/guides_tour/all");
      setGuideTours(response.data);
    } catch (err) {
      console.error("Failed to fetch guide-tour relationships.", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchGuides(),
      fetchTours(),
      fetchGuideTours(),
      fetchAdvisors(),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchSelectedGuideTours = async (guideId) => {
    try {
      const [assignedResponse, requestedResponse] = await Promise.all([
        Axios.get(`/api/guides_tour/show_guide_assigns/${guideId}/`),
        Axios.get(`/api/guides_tour/show_guide_requests/${guideId}/`),
      ]);
      const combinedTours = [
        ...assignedResponse.data,
        ...requestedResponse.data,
      ];
      setSelectedGuideTours(combinedTours);
    } catch (err) {
      console.error("Failed to fetch guide's tours:", err);
    }
  };

  const handlePersonClick = (person) => {
    if (person.responsible_day) {
      // Responsible day varsa Advisor'dır
      setSelectedPerson({ ...person, type: "advisor" });
    } else {
      // Responsible day yoksa Guide'dır
      setSelectedPerson({ ...person, type: "guide" });
      fetchSelectedGuideTours(person.id);
    }
  };

  const handleBack = () => {
    setSelectedPerson(null);
    setSelectedGuideTours([]);
  };

  const toggleSearchBar = () => {
    setSearchActive(!searchActive);
    setSearchQuery("");
    setFilteredGuides(guides);
    setFilteredAdvisors(advisors);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredGuides = guides.filter((guide) =>
      guide.name.toLowerCase().includes(query)
    );

    const filteredAdvisors = advisors.filter((advisor) =>
      advisor.name.toLowerCase().includes(query)
    );

    setFilteredGuides(filteredGuides);
    setFilteredAdvisors(filteredAdvisors);
  };

  const filterByType = (type) => {
    setFilterType(type);
  };

  const filteredList =
    filterType === "guides"
      ? filteredGuides
      : filterType === "advisors"
        ? filteredAdvisors
        : [...filteredGuides, ...filteredAdvisors];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="main-container">
      <div className="left_container">
        {activee ? (
          <>
            <div
              className="header-with-search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="search_icon"
                style={{ display: "flex", alignItems: "center" }}
              >
                <SearchIcon
                  size={20}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={toggleSearchBar}
                />
                {searchActive && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rehber veya Advisor ara..."
                    className="search-bar"
                    style={{ marginLeft: "10px" }}
                  />
                )}
              </div>

              {!searchActive && (
                <div style={{ textAlign: "center", flexGrow: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        cursor: "pointer",
                        margin: "0 10px",
                        color: filterType === "guides" ? "#F34F57" : "black",
                      }}
                      onClick={() => filterByType("guides")}
                    >
                      Rehberler
                    </h2>
                    <h2>&</h2>
                    <h2
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        cursor: "pointer",
                        margin: "0 10px",
                        color: filterType === "advisors" ? "#F34F57" : "black",
                      }}
                      onClick={() => filterByType("advisors")}
                    >
                      Danışmanlar
                    </h2>
                  </div>
                </div>
              )}

              <GradingIcon
                onClick={handleGradingIconClick}
                sx={{
                  fontSize: 30,
                  justifyContent: "center",
                  cursor: "pointer",
                  marginBottom: "20px",
                  marginRight: "10px",
                  color: showInactiveGuides ? "#F34F57" : "inherit",
                }}
              />
            </div>
            <hr className="custom-line" />
            {selectedPerson ? (
              selectedPerson.type === "advisor" ? (
                <AdvisorDetailCard
                  advisor={selectedPerson}
                  onBack={handleBack}
                  setSelectedAdvisor={setSelectedPerson}
                  fetchAdvisors={fetchAdvisors}
                />
              ) : (
                <GuideDetailCard
                  setSelectedGuide={setSelectedPerson}
                  role={role}
                  fetchGuides={fetchGuides}
                  guide={selectedPerson}
                  onBack={handleBack}
                />
              )
            ) : (
              <div>
                {filteredList.map((person, index) =>
                  person.responsible_day ? (
                    <AdvisorCard
                      key={index}
                      advisor={person}
                      onActionClick={() => handlePersonClick(person)}
                    />
                  ) : (
                    <Guide
                      key={index}
                      guide={person}
                      onActionClick={() => handlePersonClick(person)}
                      isMaxTourCount={person.tour_count === maxTourCount}
                    />
                  )
                )}
              </div>
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

      <div className="right_container">
        {activee ? (
          <>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {showInactiveGuides
                ? "Aktif Olmayan Rehberler"
                : selectedPerson
                  ? selectedPerson.responsible_day
                    ? "Tüm Rehberlerin Turları"
                    : `${selectedPerson.name} Turları`
                  : "Tüm Rehberlerin Turları"}
            </h2>
            <hr className="custom-line" />
            <div>
              {showInactiveGuides ? (
                inactiveGuides.length > 0 ? (
                  inactiveGuides.map((guide, index) => (
                    <Guide
                      key={index}
                      guide={guide}
                      onActionClick={() => handlePersonClick(guide)}
                    />
                  ))
                ) : (
                  <p>Henüz aktif olmayan rehber bulunmamaktadır.</p>
                )
              ) : selectedPerson && selectedPerson.type === "guide" ? (
                selectedGuideTours.length > 0 ? (
                  selectedGuideTours.map((tour, index) => (
                    <GuideTourCard
                      key={index}
                      guide={selectedPerson}
                      tour={tour}
                      status={tour.status}
                    />
                  ))
                ) : (
                  <p>Bu rehberin tur kaydı bulunmamaktadır.</p>
                )
              ) : guideTours.length > 0 ? (
                guideTours.map((item, index) => {
                  const guide = guides.find((g) => g.id === item.guide_id);
                  const tour = tours.find((t) => t.id === item.tour_id);

                  if (!guide || !tour) {
                    return null;
                  }

                  return (
                    <GuideTourCard
                      key={index}
                      guide={guide}
                      tour={tour}
                      status={item.status}
                    />
                  );
                })
              ) : (
                <p>Henüz rehber-tur ilişkisi bulunmamaktadır.</p>
              )}
            </div>
          </>
        )
          :
          (
            <>
              HESABINIZ AKTIF DEĞİLDİR!
              <br />
              Danışmanlarınız ile iletişime geçiniz!
            </>
          )}
      </div>
      {/* </>
        :
        <>
          HESABINIZ AKTIF DEĞİLDİR!
          <br />
          Danışmanlarınız ile iletişime geçiniz!
        </>} */}
    </div>
  );
};
export default Guides;
