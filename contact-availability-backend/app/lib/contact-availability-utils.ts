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
  holidays: PublicHoliday[],
  timezoneApi: any
): { status: 'in office' | 'public holiday' | 'weekend' | 'off hours'; recommendation: string } {
  // Get the formatted date from the Abstract Timezone API
  const formatted = timezoneApi.formatDateTimeSeparated(timezoneData);

  // Parse the time from the datetime field (local time)
  const [datePart, timePart] = timezoneData.datetime.split(' ');
  const [hour, minute, second] = timePart.split(':').map(Number);

  // Determine day of week from the formatted date string
  // Format: "Friday, June 27, 2025"
  const dayMatch = formatted.date.match(/^(\w+),/);
  if (!dayMatch) {
    throw new Error('Could not parse day from formatted date');
  }

  const dayName = dayMatch[1];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames.indexOf(dayName);

  // Use the date part directly from datetime field for holiday checking
  const currentDateString = datePart; // Already in YYYY-MM-DD format

  const currentHour = hour;

  // Helper function to get the next available weekday
  function getNextAvailableWeekday(currentDay: number, currentDateString: string, holidays: PublicHoliday[]): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // First, check if today is a weekday and before 9AM - if so, recommend today at 9AM
    if (currentDay >= 1 && currentDay <= 5 && currentHour < 9) {
      const isTodayHoliday = holidays.some(holiday => holiday.date === currentDateString);
      if (!isTodayHoliday) {
        return 'Call today at 9AM';
      }
    }

    // Calculate next available weekday
    let nextDay = currentDay;
    let daysAhead = 1;

    while (daysAhead <= 7) {
      nextDay = (currentDay + daysAhead) % 7;

      if (nextDay >= 1 && nextDay <= 5) {
        // Calculate the date for this future day
        const futureDate = new Date(currentDateString);
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const futureDateString = futureDate.toISOString().split('T')[0];

        const isHoliday = holidays.some(holiday => holiday.date === futureDateString);
        if (!isHoliday) {
          if (daysAhead === 1) {
            return 'Call tomorrow at 9AM';
          } else {
            return `Call ${dayNames[nextDay]} at 9AM`;
          }
        }
      }

      daysAhead++;
    }

    // Fallback
    return 'Call next weekday at 9AM';
  }

  // Check if today is a public holiday
  const isHoliday = holidays.some(holiday => holiday.date === currentDateString);
  if (isHoliday) {
    return {
      status: 'public holiday',
      recommendation: getNextAvailableWeekday(currentDay, currentDateString, holidays)
    };
  }

  // Check if it's weekend
  if (currentDay === 0 || currentDay === 6) { // Sunday or Saturday
    return {
      status: 'weekend',
      recommendation: getNextAvailableWeekday(currentDay, currentDateString, holidays)
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
    recommendation: getNextAvailableWeekday(currentDay, currentDateString, holidays)
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
