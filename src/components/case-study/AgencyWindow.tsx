import React from 'react';
import BrowserWindow from './BrowserWindow';

export default function AgencyWindow() {
  return (
    <BrowserWindow url="ark-studio.com" className="my-12">
      <iframe 
        src="/" 
        className="w-full h-full border-0 bg-[#f5f5f5]"
        title="Agency Site Preview"
        loading="lazy"
        style={{ height: '800px' }} // Taller height to allow for proper hero scaling
      />
    </BrowserWindow>
  );
}
