import React, { useState, useEffect } from "react";
import {
  DescriptionList,
  DescriptionListItem,
  Divider,
  ErrorState,
  Flex,
  Heading,
  List,
  StatusTag,
  Text,
  hubspot
} from "@hubspot/ui-extensions";
import { Availability } from "./types/Availability";

const BASE_URL = 'https://uie-contact-call-availability-one.vercel.app/api/contact-availability';

hubspot.extend(({ actions }) => <Extension actions={actions} />);

const Extension = ({ actions }) => {
  const { fetchCrmObjectProperties } = actions;

  const [firstName, setFirstName] = useState('');
  const [locationData, setLocationData] = useState({ city: '', state: '', country: '' });
  const [availabilityData, setAvailabilityData] = useState<Availability | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // 1. Retrieve the name and location properties from HubSpot
        const properties = await fetchCrmObjectProperties(['firstname', 'city', 'state', 'country']);

        // 2. Return an error state if name, city, or country are missing from the response
        if (!properties.firstname || !properties.city || !properties.country) {
          setHasError(true);
          return;
        }

        // 3. Store the name and location
        setFirstName(properties.firstname);
        setLocationData({
          city: properties.city,
          state: properties.state || '',
          country: properties.country
        });

        // 4. Build the URL for the Global Contact Availability API
        const url = `${BASE_URL}?city=${encodeURIComponent(properties.city)}${properties.state ? `&state=${encodeURIComponent(properties.state)}` : ''}&country=${encodeURIComponent(properties.country)}`;

        // 5. Query availability
        const response = await hubspot.fetch(url);
        const data = await response.json();

        // 6. Store availability response
        setAvailabilityData(data);

      } catch (error) {
        console.error('Error fetching properties:', error);
        setHasError(true);
      }
    };

    fetchProperties();
  }, [fetchCrmObjectProperties]);

  if (hasError) {
    return (
      <ErrorState title="Trouble fetching properties">
        <Text>
          Please try again soon.
        </Text>
      </ErrorState>
    );
  }

  return (
    <>
      <Heading>Availability for {firstName}</Heading>

      <Divider />

      {
        availabilityData && <>
          {/* LOCATION INFORMATION */}
          <Text format={{ fontWeight: 'bold' }}>🌎 Local Information</Text>
          <DescriptionList direction="row">
            {/* STATUS */}
            <DescriptionListItem label={'Status'}>
              <Text format={{ fontWeight: 'bold' }}>
                <StatusTag variant={availabilityData.availability.status === 'in office' ? 'success' : 'danger'}>Currently </StatusTag>
                {availabilityData.availability.status}
              </Text>
            </DescriptionListItem>
            {/* LOCATION */}
            <DescriptionListItem label={'📍 Location'}>
              <Text>{locationData.city}, {locationData.state ? `${locationData.state},` : ''} {locationData.country}</Text>
            </DescriptionListItem>
            {/* LOCAL TIME */}
            <DescriptionListItem label={'🕰️ Local Time'}>
              <Flex direction='column' gap="xs">
                <Text>{availabilityData.datetime.date}</Text>
                <Text>{availabilityData.datetime.localTime} {availabilityData.datetime.timezone}</Text>
              </Flex>
            </DescriptionListItem>
          </DescriptionList>

          <Divider />

          {/* UPCOMING HOLIDAYS */}
          <Text format={{ fontWeight: 'bold' }}>🔔 Holiday Alerts</Text>
          <Text>Holidays coming up in the next 30 days:</Text>
          {
            availabilityData.holidays.length === 0 ? (
              <Text format={{ italic: true}}>No holidays coming up in the next 30 days</Text>
            ) : (
              <List variant="unordered-styled">
                {
                  availabilityData.holidays.map((holiday) => (
                    <Text format={{ fontWeight: 'bold' }}>{holiday.date}: <Text inline={true}>{holiday.name}</Text></Text>
                  ))
                }
              </List>
          )}

          <Divider />

          {/* CURRENT CALL RECOMMENDATION */}
          <Text format={{ fontWeight: 'bold' }}>📞 Recommendation: <Text inline={true}>{availabilityData.availability.recommendation}</Text></Text>

        </>
      }

    </>
  );
};

