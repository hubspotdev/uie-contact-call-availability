# Contact Availability Backend API

A Next.js backend API that provides real-time contact availability information for HubSpot UI Extensions. This API integrates with external services to determine timezone data, public holidays, and availability status for contacts worldwide.

## 🎯 Overview

This backend serves as the data layer for the **Contact Global Availability** HubSpot UI Extension. It provides intelligent availability insights by:

- **Timezone Detection**: Using Abstract Timezone API to get real-time local time for any location
- **Holiday Checking**: Integrating with Nager.Date API to identify public holidays
- **Availability Logic**: Determining if contacts are in office, on holiday, or outside business hours
- **Smart Recommendations**: Suggesting optimal call times based on availability status

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HubSpot UI    │    │   Next.js API    │    │  External APIs  │
│   Extension     │◄──►│   Backend        │◄──►│                 │
│                 │    │                  │    │ • Abstract API  │
│ • Contact Card  │    │ • API Routes     │    │ • Nager.Date    │
│ • Real-time UI  │    │ • Business Logic │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
contact-availability-backend/
├── app/
│   ├── api/                          # API route handlers
│   │   ├── contact-availability/     # Main availability endpoint
│   │   ├── abstract-timezone/        # Timezone API wrapper
│   │   ├── nager-date/               # Holiday API wrapper
│   │   └── hello/                    # Health check endpoint
│   ├── lib/                          # Utility libraries
│   │   ├── contact-availability-utils.ts    # Core availability logic
│   │   ├── abstract-timezone-api.ts         # Abstract API client
│   │   ├── nager-date-api.ts                # Nager.Date API client
│   │   └── isoToCountryCode.ts              # Country code utilities
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
├── public/                           # Static assets
├── package.json                      # Dependencies and scripts
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── .env                              # Environment variables
```

## 🚀 API Endpoints

### 1. Contact Availability API
**Endpoint**: `GET /api/contact-availability`

**Purpose**: Main endpoint that provides comprehensive availability information for a contact.

**Query Parameters**:
- `city` (required): City name (e.g., "Boston")
- `state` (optional): State/province (e.g., "MA")
- `country` (required): Country name (e.g., "United States")

**Example Request**:
```bash
GET /api/contact-availability?city=Boston&state=MA&country=United%20States
```

**Response**:
```json
{
  "datetime": {
    "date": "Friday, June 27, 2025",
    "localTime": "2:30:45 PM",
    "timezone": "EDT"
  },
  "availability": {
    "status": "in office",
    "recommendation": "free to call"
  },
  "holidays": [
    {
      "date": "2025-07-04",
      "localName": "Independence Day",
      "name": "Independence Day",
      "countryCode": "US",
      "fixed": true,
      "global": false,
      "counties": null,
      "launchYear": null,
      "types": ["Public"]
    }
  ]
}
```

**Availability Statuses**:
- `in office`: Contact is available during business hours (9 AM - 5 PM, weekdays)
- `public holiday`: Contact's location has a public holiday today
- `weekend`: Contact is not available (Saturday/Sunday)
- `off hours`: Contact is outside business hours on a weekday

### 2. Abstract Timezone API Wrapper
**Endpoint**: `GET /api/abstract-timezone`

**Purpose**: Direct access to timezone information for a location.

**Query Parameters**:
- `location` (required): City, state, country, coordinates, or IP address

### 3. Nager.Date API Wrapper
**Endpoint**: `GET /api/nager-date`

**Purpose**: Direct access to public holiday information for a country.

**Query Parameters**:
- `countryCode` (required): ISO 3166-1 alpha-2 country code (e.g., "US")

## 🔧 Core Libraries

### `contact-availability-utils.ts`
Contains the main business logic for determining contact availability:

- **`determineAvailabilityStatus()`**: Analyzes timezone data and holidays to determine availability
- **`formatTimezoneData()`**: Formats timezone information for display
- **`ContactAvailabilityResponse`**: TypeScript interface for API responses

### `abstract-timezone-api.ts`
Comprehensive wrapper for the Abstract Timezone API:

- **`AbstractTimezoneAPI`**: Main class with methods for timezone operations
- **`getCurrentTime()`**: Get current time for any location
- **`formatDateTimeSeparated()`**: Format date and time for display
- **`createAbstractTimezoneAPI()`**: Factory function with environment configuration

### `nager-date-api.ts`
Service for fetching public holiday data:

- **`NagerDateApiService`**: Main service class
- **`getHolidaysForRange()`**: Get holidays within the next 30 days
- **`isTodayHoliday()`**: Check if today is a public holiday
- **`nagerDateApi`**: Singleton instance for easy import

### `isoToCountryCode.ts`
Utilities for country code conversion:

- **`getCountryCode()`**: Convert country names to ISO codes
- **`getSupportedCountries()`**: List of supported countries

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Abstract Timezone API key (free tier available)
- Vercel account (for deployment)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd contact-availability-backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Add your Abstract Timezone API key:
   ```env
   ABSTRACT_TIMEZONE_API_KEY=your_api_key_here
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test the API**:
   ```bash
   curl "http://localhost:3000/api/contact-availability?city=Boston&state=MA&country=United%20States"
   ```

### Production Deployment

1. **Deploy to Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Update HubSpot app configuration** with your production API URL

## 🔍 Testing

### Using Postman
Import the HubSpot Postman Workspace for testing:
1. Open Postman
2. Import workspace: `https://www.postman.com/hubspot/hubspot-public-api-workspace/overview`
3. Test endpoints with sample data

### Using curl
```bash
# Test contact availability
curl "https://your-api.vercel.app/api/contact-availability?city=London&country=United%20Kingdom"

# Test timezone API
curl "https://your-api.vercel.app/api/abstract-timezone?location=Tokyo,Japan"

# Test holiday API
curl "https://your-api.vercel.app/api/nager-date?countryCode=US"
```

## 🔗 External Dependencies

- **[Abstract Timezone API](https://docs.abstractapi.com/timezones)**: Real-time timezone and location data
- **[Nager.Date API](https://date.nager.at/Api)**: Public holiday information worldwide
- **[Next.js](https://nextjs.org/)**: React framework for API routes
