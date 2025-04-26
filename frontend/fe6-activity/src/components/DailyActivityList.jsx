import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Star, Bolt, Circle } from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ActivityCalendar.css';

const DailyActivityList = React.memo(({ daily_activities_prop }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const getActivitiesForDate = (date) => {
    return daily_activities_prop.filter(activity => 
      new Date(activity.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="activity-container">
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
      </div>
      <div className="activity-list">
        <h3>Activities on {selectedDate.toDateString()}</h3>
        {getActivitiesForDate(selectedDate).map((activity, index) => (
          <div 
            key={activity.daily_activity_id || `daily-activity-${index}`}
            className="activity-card"
          >
            <div className="activity-header">
              <div className="activity-header-left">
                <div className="activity-icon">
                  {activity.type === 'major' ? <Star color="primary" /> : activity.type === 'network' ? <Circle color="action" /> : <Bolt color="secondary" />}
                </div>
                <h3 className="activity-title">{activity.title}</h3>
              </div>
            </div>
            <div className="activity-content">
              <p className="activity-description">{activity.description}</p>
              <div className="activity-meta">
                <span className="activity-date">
                  {formatDate(activity.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

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

export default DailyActivityList; 