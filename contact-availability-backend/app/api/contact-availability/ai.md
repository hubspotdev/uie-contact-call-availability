I want to create a Contact Availability API Route based on the date and time of the request.

INPUTS:
 - city
- maybe state
- country

OUTPUT:
{
 "datetime": {
   "date": "2021-01-01", // from abstract-timezone API
   "localTime": "12:00:00" //from abstract-timezone API
   "timezome" // from from abstract-timezone API
  },

 "availability":{
    "status": ['in office' | 'public holiday' | 'weekend' | 'off hours']
    "recommendation": [if status is NOT in office, recommend a time to call]
  },

  "holidays": [
     array of holidays from nager-date-api.ts
  ]
}

APIS:
Use the APIs defined in this project:

1. Nager-date API (`nager-date-api.ts)
Use the Nager Date API I've created to return the holidays for the next 30 days in the output array as described above.

Example API call: `localhost:3001/api/nager-date?countryCode=US&range=next30days`

Example API return:

```
{
    "holidays": [
        {
            "date": "2025-07-04",
            "localName": "Independence Day",
            "name": "Independence Day",
            "countryCode": "US",
            "fixed": false,
            "global": true,
            "counties": null,
            "launchYear": null,
            "types": [
                "Public"
            ]
        }
    ]
}
```

2. Abstract Timezone API (abstract-timezone-api)

Use the Abstract Timezone API I've created to return date time and timezone information for the given city, state, country.

Example API call: `http://localhost:3001/api/abstract-timezone?location=Boston,MA`

Example API return:

```
{
    "success": true,
    "data": {
        "datetime": "2025-06-26 20:41:42",
        "timezone_name": "Eastern Daylight Time",
        "timezone_location": "America/New_York",
        "timezone_abbreviation": "EDT",
        "gmt_offset": -4,
        "is_dst": true,
        "requested_location": "Boston,MA",
        "latitude": 42.3554334,
        "longitude": -71.060511
    },
    "formatted": {
        "date": "Thursday, June 26, 2025",
        "time": "08:41:42 PM EDT",
        "timezoneOffset": "GMT-04:00"
    }
}
```

AVAILABILITY:
The availability section of the API will have two components: a status and recommendation

The Availability Status is the current availability of a person based on their location.
Determining status:

PUBLIC HOLIDAY: If it is a public holiday, the status is public holiday

IN OFFICE: If it is between the hours of 9AM and 5PM in the persons local time AND the day of the week is Monday thru Friday AND it is not a public holiday , the status is in office

OFF HOURS: If it is Monday thru Friday, and it is NOT a public holiday, and it is NOT Saturday or Sunday, the status is out of office

WEEKEND: If it is Saturday or Sunday, the status is weekend.

Recommendation:
If the status IS NOT IN OFFICE, we should provide a recommendation for the next available time to call.

Example #1: If it is a public holiday and a weekday, the recommendation should be to call the next week day at 9AM
Example #2: If it is a weekend, the recommendation should be to call the next week day at 9AM
Example #3: If it is a week day, but it's after hours or before hours, the recommendation should to be to call at 9AM the next week day
Example #4: If the status is IN OFFICE, the recommendation should be "free to call"
