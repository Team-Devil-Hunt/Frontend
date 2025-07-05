import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Archive, ArchiveRestore, Check, X, AlertCircle } from 'lucide-react';

const MeetingCard = ({ meeting, onRSVP, onArchiveToggle }) => {
  // Get meeting type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'academic':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-700',
          light: 'bg-blue-50',
          badge: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'research':
        return {
          bg: 'bg-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-700',
          light: 'bg-purple-50',
          badge: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'career':
        return {
          bg: 'bg-green-600',
          border: 'border-green-500',
          text: 'text-green-700',
          light: 'bg-green-50',
          badge: 'bg-green-100 text-green-800 border-green-200'
        };
      default:
        return {
          bg: 'bg-gray-600',
          border: 'border-gray-500',
          text: 'text-gray-700',
          light: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  // Get RSVP status badge
  const getRSVPBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <X className="w-3 h-3 mr-1" />
            Declined
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Response Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            No Response
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if RSVP deadline has passed
  const isRSVPDeadlinePassed = () => {
    const deadline = new Date(meeting.rsvpDeadline);
    return deadline < new Date();
  };

  const colors = getTypeColor(meeting.type);
  const isPast = new Date(meeting.date) < new Date();
  const canRSVP = !isPast && !isRSVPDeadlinePassed() && meeting.rsvpStatus !== 'confirmed' && meeting.rsvpStatus !== 'declined';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${meeting.isArchived ? 'opacity-75' : ''}`}>
      <div className={`h-2 ${colors.bg}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge} mr-2`}>
                {meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}
              </span>
              {meeting.status === 'cancelled' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  Cancelled
                </span>
              )}
              {meeting.isArchived && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  Archived
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{meeting.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
          </div>
          <div className="ml-4">
            {getRSVPBadge(meeting.rsvpStatus)}
          </div>
        </div>

        <div className="flex items-center mb-3">
          <img
            src={meeting.facultyImage || '/assets/profile-placeholder.jpg'}
            alt={meeting.facultyName}
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{meeting.facultyName}</p>
            <p className="text-xs text-gray-500">{meeting.facultyDepartment}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(meeting.date)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {meeting.startTime} - {meeting.endTime}
          </div>
          <div className="flex items-center text-sm text-gray-600 md:col-span-2">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {meeting.location}
          </div>
        </div>

        {meeting.notes && (
          <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 mb-4">
            <p className="font-medium mb-1">Notes:</p>
            <p>{meeting.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <div className="space-x-2">
            {canRSVP ? (
              <button
                onClick={() => onRSVP(meeting)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Respond
              </button>
            ) : (
              meeting.rsvpStatus === 'confirmed' && (
                <button
                  onClick={() => onRSVP(meeting)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Response
                </button>
              )
            )}
          </div>
          
          <button
            onClick={() => onArchiveToggle(meeting.id)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {meeting.isArchived ? (
              <>
                <ArchiveRestore className="h-4 w-4 mr-1" />
                Unarchive
              </>
            ) : (
              <>
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
