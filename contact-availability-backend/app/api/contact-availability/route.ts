import { NextRequest, NextResponse } from 'next/server';
import { createAbstractTimezoneAPI, AbstractTimezoneResponse } from '@/app/lib/abstract-timezone-api';
import { nagerDateApi } from '@/app/lib/nager-date-api';
import { getCountryCode, getSupportedCountries } from '@/app/lib/isoToCountryCode';
import {
  ContactAvailabilityResponse,
  determineAvailabilityStatus,
  formatTimezoneData
} from '@/app/lib/contact-availability-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const country = searchParams.get('country');

    // Validate required parameters
    if (!city || !country) {
      return NextResponse.json(
        {
          error: 'City and country parameters are required. Use ?city=Boston&state=MA&country=United States'
        },
        { status: 400 }
      );
    }

    // Convert country to ISO code
    const countryCode = getCountryCode(country);

    if (!countryCode) {
      const supportedCountries = getSupportedCountries().slice(0, 10); // Show first 10 as examples
      return NextResponse.json(
        {
          error: `Unsupported country: "${country}". Please use a valid country name like: ${supportedCountries.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Build location string for timezone API
    const locationParts = [city];
    if (state) {
      locationParts.push(state);
    }
    locationParts.push(country);
    const location = locationParts.join(',');

    // Get timezone data
    const timezoneApi = createAbstractTimezoneAPI();
    const timezoneData: AbstractTimezoneResponse = await timezoneApi.getCurrentTime(location);

    // Get holidays for the next 30 days
    const holidays = await nagerDateApi.getHolidaysForRange(countryCode);

    // Determine availability status
    const availability = determineAvailabilityStatus(timezoneData, holidays);

    // Format the response
    const response: ContactAvailabilityResponse = {
      datetime: formatTimezoneData(timezoneData, timezoneApi),
      availability,
      holidays
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Contact Availability API Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          success: false
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        success: false
      },
      { status: 500 }
    );
  }
}
