// Types for the Abstract Timezone API response
export interface AbstractTimezoneResponse {
  datetime: string;
  timezone_name: string;
  timezone_location: string;
  timezone_abbreviation: string;
  gmt_offset: number;
  is_dst: boolean;
  requested_location: string;
  latitude: number;
  longitude: number;
}

// Types for API error responses
export interface AbstractTimezoneError {
  error: {
    message: string;
    code?: string;
  };
}

// Configuration interface
export interface AbstractTimezoneConfig {
  apiKey: string;
  baseUrl?: string;
}

// Main class for Abstract Timezone API
export class AbstractTimezoneAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AbstractTimezoneConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://timezone.abstractapi.com/v1';
  }

  /**
   * Get current time for a specific location
   * @param location - City, state, country, coordinates, or IP address
   * @returns Promise with timezone information
   */
  async getCurrentTime(location: string): Promise<AbstractTimezoneResponse> {
    try {
      const url = new URL(`${this.baseUrl}/current_time`);
      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('location', location);

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json() as AbstractTimezoneError;
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as AbstractTimezoneResponse;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get current time for ${location}: ${error.message}`);
      }
      throw new Error(`Failed to get current time for ${location}: Unknown error`);
    }
  }

  /**
   * Get current time by coordinates
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Promise with timezone information
   */
  async getCurrentTimeByCoordinates(latitude: number, longitude: number): Promise<AbstractTimezoneResponse> {
    const location = `${latitude},${longitude}`;
    return this.getCurrentTime(location);
  }

  /**
   * Get current time by IP address
   * @param ipAddress - IP address
   * @returns Promise with timezone information
   */
  async getCurrentTimeByIP(ipAddress: string): Promise<AbstractTimezoneResponse> {
    return this.getCurrentTime(ipAddress);
  }

  /**
   * Format the datetime response for display
   * @param response - API response
   * @returns Formatted date and time string
   */
  formatDateTime(response: AbstractTimezoneResponse): string {
    const date = new Date(response.datetime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      timeZone: response.timezone_location
    });
  }

  /**
   * Format just the date portion
   * @param response - API response
   * @returns Formatted date string
   */
  formatDate(response: AbstractTimezoneResponse): string {
    const date = new Date(response.datetime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: response.timezone_location
    });
  }

  /**
   * Format just the time portion
   * @param response - API response
   * @returns Formatted time string
   */
  formatTime(response: AbstractTimezoneResponse): string {
    const date = new Date(response.datetime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      timeZone: response.timezone_location
    });
  }

  /**
   * Get formatted date and time as separate fields
   * @param response - API response
   * @returns Object with separate date and time strings
   */
  formatDateTimeSeparated(response: AbstractTimezoneResponse): { date: string; time: string } {
    return {
      date: this.formatDate(response),
      time: this.formatTime(response)
    };
  }

  /**
   * Get timezone offset in hours and minutes
   * @param response - API response
   * @returns Formatted timezone offset string
   */
  getTimezoneOffset(response: AbstractTimezoneResponse): string {
    const hours = Math.floor(Math.abs(response.gmt_offset));
    const minutes = Math.abs(response.gmt_offset % 1) * 60;
    const sign = response.gmt_offset >= 0 ? '+' : '-';
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

// Utility function to create an instance with environment variable
export function createAbstractTimezoneAPI(): AbstractTimezoneAPI {
  const apiKey = process.env.ABSTRACT_TIMEZONE_API_KEY;

  if (!apiKey) {
    throw new Error('ABSTRACT_TIMEZONE_API_KEY environment variable is required');
  }

  return new AbstractTimezoneAPI({ apiKey });
}

// Example usage function
export async function getCurrentTimeForLocation(location: string): Promise<AbstractTimezoneResponse> {
  const api = createAbstractTimezoneAPI();
  return api.getCurrentTime(location);
}
