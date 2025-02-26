import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import trLocale from "@fullcalendar/core/locales/tr";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";

import "./Calender.css";

const Calender = ({ role, upcomingEvents, previousEvents }) => {
  const [activee, setActive] = useState(true);

  // const events = [
  //     ...upcomingEvents.map(event => ({
  //         ...event,
  //         className: 'upcoming-event',
  //     })),
  //     ...previousEvents.map(event => ({
  //         ...event,
  //         className: 'previous-event',
  //     })),
  // ];

  const events = [
    ...upcomingEvents.map((event) => ({
      title: event.high_school_name,
      start: event.date, // Map 'date' to 'start'
      extendedProps: { ...event },
      className: "upcoming-event",
    })),
    ...previousEvents.map((event) => ({
      title: event.high_school_name,
      start: event.date, // Map 'date' to 'start'
      extendedProps: { ...event },
      className: "previous-event",
    })),
  ];

  console.log("tourCC", upcomingEvents);
  console.log("fairCC", previousEvents);

  function renderEventContent(eventInfo) {
    return (
      <>
        <span>{eventInfo.event.extendedProps.high_school_name}</span>
      </>
    );
  }

  useEffect(() => {
    if (
      role === "guide" &&
      JSON.parse(localStorage.getItem("details")).isactive === false
    ) {
      setActive(false);
    }
  }, []);

  return (
    activee && (
      <FullCalendar
        plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        dayHeaders={true}
        weekends={true}
        eventContent={renderEventContent}
        locales={[trLocale]}
        locale="tr"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "multiMonthYear,dayGridMonth,listWeek",
        }}
      />
    )
  );
};

export default Calender;
