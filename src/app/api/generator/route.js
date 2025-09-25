import QRCode from 'qrcode';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, size = 256, errorCorrectionLevel = 'M' } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const options = {
      errorCorrectionLevel: errorCorrectionLevel,
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: parseInt(size),
    };

    const qrDataUrl = await QRCode.toDataURL(text, options);

    return NextResponse.json({
      success: true,
      qrDataUrl: qrDataUrl,
      text: text,
      size: parseInt(size)
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'QR code generation failed' }, 
      { status: 500 }
    );
  }
}
