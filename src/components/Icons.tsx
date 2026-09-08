"use client";

import Image from "next/image";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconPaths: Record<string, string> = {
  // Map icon names to SVG paths
  "acknowledgement": "/photos/ack.svg",
  "figures": "/photos/figures.svg",
  "fileformat": "/photos/fileformat.svg",
  "guidelines": "/photos/guidelines.svg",
  "formatting": "/photos/fomatting.svg",
  "illustrations": "/photos/illustrations.svg",
  "materials": "/photos/materials.svg",
  "originality": "/photos/originality.svg",
  "originalwork": "/photos/originalwork.svg",
    "references": "/photos/references.svg",
    "results": "/photos/results.svg",
  // Adod all your icon mappings here
};

export default function Icon({ name, className = "w-6 h-6", size = 24 }: IconProps) {
  const iconPath = iconPaths[name];
  
  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <Image
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
}