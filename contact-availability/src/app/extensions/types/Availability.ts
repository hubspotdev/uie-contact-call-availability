export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[];
  launchYear: number | null;
  types: string[];
}

export interface Availability {
  datetime: {
    date: string;
    localTime: string;
    timezone: string;
  };
  availability: {
    status: string;
    recommendation: string;
  };
  holidays: Holiday[];
}
