import { AbstractTimezoneResponse } from './abstract-timezone-api';
import { PublicHoliday } from './nager-date-api';

// Types for the response
export interface ContactAvailabilityResponse {
  datetime: {
    date: string;
    localTime: string;
    timezone: string;
  };
  availability: {
    status: 'in office' | 'public holiday' | 'weekend' | 'off hours';
    recommendation: string;
  };
  holidays: PublicHoliday[];
}

// Helper function to determine availability status
export function determineAvailabilityStatus(
  timezoneData: AbstractTimezoneResponse,
  holidays: PublicHoliday[]
): { status: 'in office' | 'public holiday' | 'weekend' | 'off hours'; recommendation: string } {
  const currentDate = new Date(timezoneData.datetime);
  const currentHour = currentDate.getHours();
  const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentDateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

  // Helper function to get the next available weekday
  function getNextAvailableWeekday(currentDate: Date, holidays: PublicHoliday[]): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let nextDate = new Date(currentDate);

    // First, check if today is a weekday and before 9AM - if so, recommend today at 9AM
    if (currentDay >= 1 && currentDay <= 5 && currentHour < 9) {
      const isTodayHoliday = holidays.some(holiday => holiday.date === currentDateString);
      if (!isTodayHoliday) {
        return 'Call today at 9AM';
      }
    }

    // Start checking from tomorrow
    nextDate.setDate(nextDate.getDate() + 1);

    // Check up to 7 days ahead to find the next available weekday
    for (let i = 0; i < 7; i++) {
      const nextDay = nextDate.getDay();
      const nextDateString = nextDate.toISOString().split('T')[0];

      // Check if it's a weekday (Monday-Friday) and not a holiday
      if (nextDay >= 1 && nextDay <= 5) {
        const isHoliday = holidays.some(holiday => holiday.date === nextDateString);
        if (!isHoliday) {
          // Check if it's tomorrow
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (nextDate.toDateString() === tomorrow.toDateString()) {
            return 'Call tomorrow at 9AM';
          } else {
            return `Call ${dayNames[nextDay]} at 9AM`;
          }
        }
      }

      nextDate.setDate(nextDate.getDate() + 1);
    }

    // Fallback
    return 'Call next weekday at 9AM';
  }

  // Check if today is a public holiday
  const isHoliday = holidays.some(holiday => holiday.date === currentDateString);
  if (isHoliday) {
    return {
      status: 'public holiday',
      recommendation: getNextAvailableWeekday(currentDate, holidays)
    };
  }

  // Check if it's weekend
  if (currentDay === 0 || currentDay === 6) { // Sunday or Saturday
    return {
      status: 'weekend',
      recommendation: getNextAvailableWeekday(currentDate, holidays)
    };
  }

  // Check if it's office hours (9AM to 5PM, Monday to Friday)
  if (currentHour >= 9 && currentHour < 17) {
    return {
      status: 'in office',
      recommendation: 'free to call'
    };
  }

  // If it's a weekday but outside office hours
  return {
    status: 'off hours',
    recommendation: getNextAvailableWeekday(currentDate, holidays)
  };
}

// Helper function to format timezone data
export function formatTimezoneData(timezoneData: AbstractTimezoneResponse, timezoneApi: any) {
  const formatted = timezoneApi.formatDateTimeSeparated(timezoneData);

  return {
    date: formatted.date,
    localTime: formatted.time,
    timezone: timezoneData.timezone_abbreviation
  };
}
