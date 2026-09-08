'use client';

import { useEffect, useState } from 'react';
import AdTracker from './AdTracker';

interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
}

interface AdPlacementProps {
  placement: 'sidebar' | 'header' | 'article-top' | 'article-bottom' | 'footer';
  className?: string;
}

export default function AdPlacement({ placement, className = '' }: AdPlacementProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [placement]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/ads?placement=${placement}&activeOnly=true`);
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 ${className}`}>
        <div className="h-full w-full"></div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  // Randomly select one ad if multiple are available
  const selectedAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <AdTracker
      adId={selectedAd.id}
      imageUrl={selectedAd.imageUrl}
      targetUrl={selectedAd.targetUrl}
      altText={selectedAd.name}
      placement={placement}
      className={className}
    />
  );
}