import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { EventContext } from "../context/EventContext";

const recurrenceOptions = ["None", "Daily", "Weekly", "Monthly"];

const EventForm = ({ event, date, onClose, onSave, onDelete }) => {
  const { events } = useContext(EventContext);

  const [form, setForm] = useState({
    id: event?.id || uuidv4(),
    title: event?.title || "",
    date: event?.date || (date ? format(date, "yyyy-MM-dd") : ""),
    time: event?.time || "12:00",
    description: event?.description || "",
    recurrence: event?.recurrence || "None",
  });

  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (date && !event) {
      setForm((f) => ({ ...f, date: format(date, "yyyy-MM-dd") }));
    }
  }, [date, event]);

  useEffect(() => {
    const hasConflict = events.some(
      (ev) =>
        ev.id !== form.id &&
        ev.date === form.date &&
        ev.time === form.time
    );
    setConflict(hasConflict);
  }, [form.date, form.time, form.id, events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title) {
      alert("Title required");
      return;
    }

    if (conflict) {
      alert("Event conflict detected at the same date and time!");
      return;
    }

    onSave(form);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3>{event ? "Edit Event" : "Add Event"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <label>
            Recurrence:
            <select
              name="recurrence"
              value={form.recurrence}
              onChange={handleChange}
            >
              {recurrenceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          {conflict && (
            <p style={{ color: "red" }}>
              Warning: Another event is scheduled at this time.
            </p>
          )}

          <div style={{ marginTop: "15px", textAlign: "right" }}>
            {event && (
              <button
                type="button"
                className="secondary"
                onClick={() => onDelete(event.id)}
                style={{ marginRight: "10px" }}
              >
                Delete
              </button>
            )}
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
