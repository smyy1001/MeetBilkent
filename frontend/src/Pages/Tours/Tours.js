import React, { useState, useEffect } from "react";
import TourCard from "../../Components/TourCard/TourCard";
import Container from "@mui/material/Container";
import Axios from "../../Axios";
import { Tooltip } from "@mui/material";
import "./Tours.css";
import Calender from "../../Components/Calender/Calender";

// // calender
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// const localizer = momentLocalizer(moment);

function Tours({
  role,
  calenderEvents1,
  setCalenderEvents1,
  calenderSchool1,
  setCalenderSchool1,
  calenderEvents2,
  setCalenderEvents2,
  calenderSchool2,
  setCalenderSchool2,
}) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[new Date().getDay()];
  const [tours, setTours] = useState([]);
  const [respAdvisors, setRespAdvisors] = useState([]);
  const [chosenTour, setChosenTour] = useState(null);
  const [updateGuides, setUpdateGuides] = useState(false);
  const [chosenPendingTourCard, setChosenPendingTourCard] = useState(null);
  const [chosenFinalTourCard, setChosenFinalTourCard] = useState(null);
  const [chosenPastTourCard, setChosenPastTourCard] = useState(null);
  const [chosenRejectedTourCard, setChosenRejectedTourCard] = useState(null);

  // SCHOOL
  const [schosenPastTourCard, ssetChosenPastTourCard] = useState(null);
  const [schosenPendingTourCard, ssetChosenPendingTourCard] = useState(null);
  const [schosenUpcomingTourCard, ssetChosenUpcomingTourCard] = useState(null);
  const [schosenRejectedTourCard, ssetChosenRejectedTourCard] = useState(null);

  const [activee, setActive] = useState(true);

  const events = tours
    .filter((tour) => tour.confirmation === "BTO ONAY")
    .map((tour) => {
      return {
        start: new Date(tour.date),
        end: new Date(tour.date),
        title: tour.high_school_name + " / " + tour.teacher_name,
      };
    });

  useEffect(() => {
    if (
      role === "guide" &&
      JSON.parse(localStorage.getItem("details")).isactive === false
    ) {
      setActive(false);
    }
  }, []);

  useEffect(() => {
    Axios.get("/api/tours/all")
      .then((response) => {
        setTours(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get("/api/advisors/all")
      .then((response) => {
        const responsibleAdvisors = response.data.filter((advisor) => {
          return (
            advisor.responsible_day && advisor.responsible_day.includes(today)
          );
        });
        setRespAdvisors(responsibleAdvisors);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [today]);

  // console.log("s1: ", calenderSchool1);
  // console.log("s2: ", calenderSchool2);
  // console.log("e1: ", calenderEvents1);
  // console.log("e2: ", calenderEvents2);

  return (
    <Container className="tours-main-container">
      <div className="tours-content">
        {/* LEFT CONT*/}
        <div className="tours-left-cont">
          <div className="tours-management-cont">
            <div className="tours-management-cont header">
              <Tooltip title="Listeye geri dön">
                <div
                  className="font-medium"
                  onClick={() => {
                    setChosenTour(null);
                    setChosenPendingTourCard(null);
                    setChosenFinalTourCard(null);
                    setChosenPastTourCard(null);
                    setChosenRejectedTourCard(null);
                    ssetChosenPastTourCard(null);
                    ssetChosenPendingTourCard(null);
                    ssetChosenUpcomingTourCard(null);
                    ssetChosenRejectedTourCard(null);
                    setUpdateGuides(false);
                  }}
                >
                  Turlar
                </div>
              </Tooltip>
            </div>

            <div className="tours-management-cont list">
              <TourCard
                role={role}
                tours={tours}
                setTours={setTours}
                setChosenTour={setChosenTour}
                setChosenPendingTourCard={setChosenPendingTourCard}
                setChosenFinalTourCard={setChosenFinalTourCard}
                setChosenPastTourCard={setChosenPastTourCard}
                setChosenRejectedTourCard={setChosenRejectedTourCard}
                ssetChosenPastTourCard={ssetChosenPastTourCard}
                ssetChosenPendingTourCard={ssetChosenPendingTourCard}
                ssetChosenUpcomingTourCard={ssetChosenUpcomingTourCard}
                ssetChosenRejectedTourCard={ssetChosenRejectedTourCard}
                chosenTour={chosenTour}
                chosenPendingTourCard={chosenPendingTourCard}
                chosenFinalTourCard={chosenFinalTourCard}
                chosenPastTourCard={chosenPastTourCard}
                chosenRejectedTourCard={chosenRejectedTourCard}
                schosenPastTourCard={schosenPastTourCard}
                schosenPendingTourCard={schosenPendingTourCard}
                schosenUpcomingTourCard={schosenUpcomingTourCard}
                schosenRejectedTourCard={schosenRejectedTourCard}
                setUpdateGuides={setUpdateGuides}
                updateGuides={updateGuides}
                setCalenderEvents1={setCalenderEvents1}
                setCalenderSchool1={setCalenderSchool1}
                setCalenderEvents2={setCalenderEvents2}
                setCalenderSchool2={setCalenderSchool2}
              />
            </div>
          </div>
        </div>

        {/* RIGHT CONT */}
        <div className="tours-right-cont">
          <div className="tours-calender-cont">
            {activee && (
              <>
                {role === "school" && (
                  <div className="tours-calender-cont calenderSchool">
                    <Calender
                      role={role}
                      upcomingEvents={calenderSchool1}
                      previousEvents={calenderSchool2}
                    />
                  </div>
                )}
                {role !== "school" && (
                  <div className="tours-calender-cont calender">
                    <Calender
                      role={role}
                      upcomingEvents={calenderEvents1}
                      previousEvents={calenderEvents2}
                    />
                  </div>
                )}

                {role !== "school" && (
                  <div className="tours-calender-cont advisor-panel">
                    {respAdvisors.length === 0 ? (
                      <p>Günün Sorumlusu bulunamadı.</p>
                    ) : (
                      <>
                        <p>Günün sorumluları:</p>
                        {respAdvisors.map((advisor, index) => (
                          <div
                            key={index}
                            className="tours-calender-cont advisor-panel detail"
                          >
                            <div className="advisor-detail-format">
                              <div className="advisor-detail-format2">
                                Sorumlu:
                              </div>
                              <div>{advisor.name}</div>
                            </div>
                            <div className="advisor-detail-format">
                              <div className="advisor-detail-format2">
                                Tel. No:
                              </div>
                              <div>{advisor.phone}</div>
                            </div>
                            <div className="advisor-detail-format">
                              <div className="advisor-detail-format2">
                                E-Posta:
                              </div>
                              <div>{advisor.username}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Tours;
