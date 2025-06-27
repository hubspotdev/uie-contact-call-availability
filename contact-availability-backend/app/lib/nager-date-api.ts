export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export interface NagerDateApiResponse {
  holidays: PublicHoliday[];
  error?: string;
}

export class NagerDateApiService {
  private baseUrl = 'https://date.nager.at/api/v3';

  /**
   * Get public holidays for a specific year and country
   * @param year - The year to get holidays for
   * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE')
   * @returns Promise<PublicHoliday[]>
   */
  async getPublicHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/PublicHolidays/${year}/${countryCode.toUpperCase()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const holidays: PublicHoliday[] = await response.json();
      return holidays;
    } catch (error) {
      console.error('Error fetching public holidays:', error);
      throw new Error(`Failed to fetch public holidays: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get public holidays for the current year and country
   * @param countryCode - ISO 3166-1 alpha-2 country code
   * @returns Promise<PublicHoliday[]>
   */
  async getCurrentYearHolidays(countryCode: string): Promise<PublicHoliday[]> {
    const currentYear = new Date().getFullYear();
    return this.getPublicHolidays(currentYear, countryCode);
  }

  /**
   * Check if today is a public holiday
   * @param countryCode - ISO 3166-1 alpha-2 country code
   * @returns Promise<PublicHoliday | null>
   */
  async isTodayHoliday(countryCode: string): Promise<PublicHoliday | null> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const holidays = await this.getCurrentYearHolidays(countryCode);

      const todayHoliday = holidays.find(holiday => holiday.date === today);
      return todayHoliday || null;
    } catch (error) {
      console.error('Error checking if today is a holiday:', error);
      throw new Error(`Failed to check today's holiday status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get holidays within the next 30 days from today for a given country
   * @param countryCode - ISO 3166-1 alpha-2 country code
   * @returns Promise<PublicHoliday[]>
   */
  async getHolidaysForRange(countryCode: string): Promise<PublicHoliday[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    const yearsToFetch = [today.getFullYear()];
    if (endDate.getFullYear() !== today.getFullYear()) {
      yearsToFetch.push(endDate.getFullYear());
    }

    let allHolidays: PublicHoliday[] = [];
    for (const year of yearsToFetch) {
      try {
        const yearHolidays = await this.getPublicHolidays(year, countryCode);
        allHolidays = allHolidays.concat(yearHolidays);
      } catch (error) {
        console.error(`Error fetching holidays for year ${year}:`, error);
      }
    }

    // Filter holidays within the next 30 days
    const filtered = allHolidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today && holidayDate <= endDate;
    });

    // Sort by date ascending
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return filtered;
  }
}

// Export a singleton instance
export const nagerDateApi = new NagerDateApiService();
