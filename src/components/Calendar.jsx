import React, { useContext, useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
} from "date-fns";
import { EventContext } from "../context/EventContext";
import { generateRecurringInstances } from "../utils/dateUtils";
import EventForm from "./EventForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Calendar = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useContext(EventContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Generate all instances including recurrence
  const displayedEvents = useMemo(() => {
    let allEvents = [];
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    events.forEach((ev) => {
      if (ev.recurrence && ev.recurrence !== "None") {
        allEvents = allEvents.concat(generateRecurringInstances(ev, start, end));
      } else {
        allEvents.push(ev);
      }
    });

    return allEvents;
  }, [events, currentMonth]);

  // Filtered Events (based on search)
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return displayedEvents;

    const query = searchQuery.toLowerCase();

    return displayedEvents.filter(
      (ev) => ev.title && ev.title.toLowerCase().includes(query)
    );
  }, [searchQuery, displayedEvents]);

  // Map events by date
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!ev.date) {
        console.warn("Event missing date:", ev);
        return;
      }
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // Get filtered dates with events (only when searchQuery is active)
  const filteredDatesWithEvents = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return Object.keys(eventsByDate).filter(dateStr => eventsByDate[dateStr]?.length > 0);
  }, [eventsByDate, searchQuery]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const eventId = draggableId;
    const eventToMove = events.find((ev) => ev.id === eventId);
    if (!eventToMove) return;

    const newDate = destination.droppableId;

    if (!eventToMove.recurrence || eventToMove.recurrence === "None") {
      updateEvent({ ...eventToMove, date: newDate });
    } else {
      alert("Cannot move recurring event instances individually!");
    }
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div>

      {/* 🔍 Search Bar */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "60%",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div className="calendar-header" style={{ marginBottom: "10px" }}>
        <button onClick={prevMonth}>&lt; Prev</button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth}>Next &gt;</button>
      </div>

      <div className="calendar-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{ fontWeight: "bold", textAlign: "center", padding: "5px" }}
          >
            {d}
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="calendar-grid"
          style={{
            gridTemplateColumns: "repeat(7, 1fr)",
            gridAutoRows: "minmax(100px, auto)",
          }}
        >
          {searchQuery.trim() === "" ? (
            // SHOW FULL MONTH GRID WHEN NO SEARCH QUERY

            <>
              {Array(daysInMonth[0].getDay())
                .fill(null)
                .map((_, idx) => (
                  <div key={"blank" + idx} className="day-cell" />
                ))}

              {daysInMonth.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate[dateStr] || [];

                return (
                  <Droppable key={dateStr} droppableId={dateStr}>
                    {(provided, snapshot) => (
                      <div
                        className={`day-cell ${isToday(day) ? "current-day" : ""}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        onClick={() => {
                          setSelectedDate(day);
                          setEditingEvent(null);
                        }}
                        style={{ background: snapshot.isDraggingOver ? "#e3f2fd" : "" }}
                      >
                        <div style={{ fontWeight: "bold" }}>{format(day, "d")}</div>
                        {dayEvents.map((ev, idx) => (
                          <Draggable key={ev.id} draggableId={ev.id} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="event-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEvent(ev);
                                  setSelectedDate(day);
                                }}
                              >
                                {ev.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </>
          ) : (
            // SHOW ONLY DAYS WITH MATCHING EVENTS WHEN SEARCH ACTIVE
            filteredDatesWithEvents.length === 0 ? (
              <div
                style={{ gridColumn: "span 7", textAlign: "center", padding: "20px" }}
              >
                No events found.
              </div>
            ) : (
              filteredDatesWithEvents.map((dateStr) => {
                const day = new Date(dateStr + "T00:00:00");
                const dayEvents = eventsByDate[dateStr] || [];

                return (
                  <Droppable key={dateStr} droppableId={dateStr}>
                    {(provided, snapshot) => (
                      <div
                        className={`day-cell ${isToday(day) ? "current-day" : ""}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        onClick={() => {
                          setSelectedDate(day);
                          setEditingEvent(null);
                        }}
                        style={{ background: snapshot.isDraggingOver ? "#e3f2fd" : "" }}
                      >
                        <div style={{ fontWeight: "bold" }}>{format(day, "d")}</div>
                        {dayEvents.map((ev, idx) => (
                          <Draggable key={ev.id} draggableId={ev.id} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="event-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEvent(ev);
                                  setSelectedDate(day);
                                }}
                              >
                                {ev.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })
            )
          )}
        </div>
      </DragDropContext>

      {(selectedDate || editingEvent) && (
        <EventForm
          event={editingEvent}
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
          onSave={(eventData) => {
            if (editingEvent) updateEvent(eventData);
            else addEvent(eventData);
            setSelectedDate(null);
            setEditingEvent(null);
          }}
          onDelete={(id) => {
            deleteEvent(id);
            setSelectedDate(null);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
