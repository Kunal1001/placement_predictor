import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    
    const response = await axios.post(
      'http://127.0.0.1:5000/predict',
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error in POST /api/predict:', error);
    return NextResponse.json(
      { error: 'Error making prediction' },
      { status: 500 }
    );
  }
}
