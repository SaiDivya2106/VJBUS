import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ActivityCalendar.css'; // Custom CSS for styling

const ActivityCalendar = ({ activities }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const getActivitiesForDate = (date) => {
    return activities.filter(activity => 
      new Date(activity.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="activity-calendar">
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileContent={({ date, view }) => {
          const dayActivities = getActivitiesForDate(date);
          return (
            <div>
              {dayActivities.length > 0 && <span className="dot">•</span>}
            </div>
          );
        }}
      />
      <div className="activity-details">
        <h3>Activities on {selectedDate.toDateString()}</h3>
        <ul>
          {getActivitiesForDate(selectedDate).map(activity => (
            <li key={activity.id}>
              {activity.title} - {activity.duration} min
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityCalendar;