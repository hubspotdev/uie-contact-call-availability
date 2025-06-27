import { NextRequest, NextResponse } from 'next/server';
import { nagerDateApi } from '@/app/lib/nager-date-api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get('countryCode');
  const yearParam = searchParams.get('year');
  const range = searchParams.get('range');

  if (!countryCode) {
    return NextResponse.json({ error: 'Missing countryCode parameter' }, { status: 400 });
  }

  try {
    let holidays;

    if (range === 'next30days') {
      // Use the new getHolidaysForRange function
      holidays = await nagerDateApi.getHolidaysForRange(countryCode);
    } else {
      // Use the original getPublicHolidays function
      const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
      holidays = await nagerDateApi.getPublicHolidays(year, countryCode);
    }

    return NextResponse.json({ holidays });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
