// src/components/admin/planning/PlanningWeekView.jsx - Version mise à jour avec accordéon
import React from 'react';
import PlanningWeekAccordion from './PlanningWeekAccordion';

const PlanningWeekView = ({ bookings, currentDate, groupBookingsByDay }) => {
  return <PlanningWeekAccordion bookings={bookings} currentDate={currentDate} groupBookingsByDay={groupBookingsByDay} />;
};

export default PlanningWeekView;