import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Authenticated'
  })
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Ready to authenticate'
  })
}