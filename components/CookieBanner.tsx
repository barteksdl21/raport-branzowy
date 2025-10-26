"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for client-side navigation

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_given');
    // Only show banner if consent hasn't been given
    if (consent !== 'true') { // Check specifically for 'true'
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_given', 'true');
    setShowBanner(false);

    // Update Google Analytics consent
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
        // If you use other Google services like Ads, you might add:
        // 'ad_storage': 'granted',
        // 'ad_user_data': 'granted',
        // 'ad_personalization': 'granted',
      });
      console.log('Cookie consent given and GA updated.');
    } else {
      console.log('Cookie consent given, but gtag function not found.');
    }
  };

  if (!showBanner) {
    return null;
  }

return (
  <div style={{
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'hsl(var(--primary))', // Navy blue from globals.css
    color: 'hsl(var(--primary-foreground))',
    padding: '12px',
    textAlign: 'center',
    zIndex: 1000,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
  }}>
    <p style={{ margin: '0 0 12px 0', fontSize: '11px', lineHeight: '1.6' }}>
      Używamy plików cookies, aby zapewnić najlepszą jakość korzystania z naszej witryny. Kontynuując, wyrażasz zgodę na ich użycie. Dowiedz się więcej w naszej polityce prywatności.
    </p>
    <button
      onClick={handleAccept}
      style={{
        backgroundColor: 'hsl(var(--secondary))', // Orange from globals.css
        color: 'hsl(var(--primary-foreground))',
        border: 'none',
        padding: '4px 24px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease'
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'hsl(30 100% 45%)')} // Darker orange on hover, derived from --secondary
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'hsl(var(--secondary))')}
    >
      Akceptuję
    </button>
  </div>
);
};

export default CookieBanner;
