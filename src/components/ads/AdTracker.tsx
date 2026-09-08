'use client';

import { useEffect, useRef, useState } from 'react';
import { getOrCreateSessionId } from '@/lib/session';
import Image from 'next/image';

interface AdTrackerProps {
  adId: string;
  imageUrl: string;
  targetUrl: string;
  altText?: string;
  placement: string;
  className?: string;
}

export default function AdTracker({
  adId,
  imageUrl,
  targetUrl,
  altText = 'Advertisement',
  placement,
  className = '',
}: AdTrackerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const viewStartTime = useRef<number | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    if (!sessionId || !adRef.current) return;

    const currentPage = window.location.pathname;

    // Track impression when ad enters viewport
    const impressionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression) {
            trackImpression();
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.01 } // Track as soon as 1% is visible
    );

    // Track view when ad is 50% visible for 1 second
    const viewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Start timing
            if (!viewStartTime.current) {
              viewStartTime.current = Date.now();
              
              // Track view after 1 second
              setTimeout(() => {
                if (viewStartTime.current && !hasTrackedView) {
                  const duration = Date.now() - viewStartTime.current;
                  trackView(duration);
                  setHasTrackedView(true);
                }
              }, 1000);
            }
          } else {
            // Reset if ad leaves viewport
            viewStartTime.current = null;
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    impressionObserver.observe(adRef.current);
    viewObserver.observe(adRef.current);

    async function trackImpression() {
      try {
        await fetch('/api/ads/track/impression', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adId,
            sessionId,
            page: currentPage,
          }),
        });
      } catch (error) {
        console.error('Error tracking impression:', error);
      }
    }

    async function trackView(duration: number) {
      try {
        await fetch('/api/ads/track/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adId,
            sessionId,
            page: currentPage,
            viewDuration: duration,
          }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }

    return () => {
      impressionObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [sessionId, adId, hasTrackedImpression, hasTrackedView]);

  const handleClick = async () => {
    if (!sessionId) return;

    try {
      await fetch('/api/ads/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId,
          sessionId,
          page: window.location.pathname,
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Open in new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <div
        onClick={handleClick}
        className="cursor-pointer hover:opacity-90 transition-opacity"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={altText}
          
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">Advertisement</div>
      </div>
    </div>
  );
}