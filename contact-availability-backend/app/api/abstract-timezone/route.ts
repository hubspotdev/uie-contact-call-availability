import { NextRequest, NextResponse } from 'next/server';
import { createAbstractTimezoneAPI, AbstractTimezoneResponse } from '@/app/lib/abstract-timezone-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        {
          error: 'Location parameter is required. Use ?location=City,State or ?location=City,Country'
        },
        { status: 400 }
      );
    }

    const api = createAbstractTimezoneAPI();
    const timezoneData: AbstractTimezoneResponse = await api.getCurrentTime(location);

    return NextResponse.json({
      success: true,
      data: timezoneData,
      formatted: {
        ...api.formatDateTimeSeparated(timezoneData),
        timezoneOffset: api.getTimezoneOffset(timezoneData)
      }
    });

  } catch (error) {
    console.error('Abstract Timezone API Error:', error);

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
