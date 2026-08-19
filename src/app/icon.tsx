import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <line x1="11.15" y1="4" x2="6.05" y2="28" stroke="white" strokeWidth="2.5" />
          <line x1="12.60" y1="16" x2="24.72" y2="6" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="square" />
          <line x1="12.60" y1="16" x2="20.47" y2="26" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
