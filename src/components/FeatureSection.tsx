export default function FeatureSection() {
  const features = [
    {
      id: 1,
      title: "Peer-Reviewed Excellence",
      description: "Rigorous double-blind peer review process ensuring academic quality and integrity in all published works.",
      imageSrc: "/photos/icon1.svg"
    },
    {
      id: 2,
      title: "Open Access",
      description: "Immediate free access to all published content maximizing visibility and global research impact.",
      imageSrc: "/photos/icon2.svg"
    },
    {
      id: 3,
      title: "Global Reach",
      description: "International editorial board and contributors from 50+ countries fostering diverse perspectives.",
      imageSrc: "/photos/icon3.svg"
    },
    {
      id: 4,
      title: "Rapid Publication",
      description: "Efficient submission-to-publication workflow with 8-12 week average acceptance time.",
      imageSrc: "/photos/icon4.svg"
    }
  ];

  return (
    <section className="h-[80vh] flex items-center px-6  bg-white">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Heading */}
        <div className="text-center mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-3">
            Why <span className="italic">Choose</span> JHSSI
          </h2>
          
          {/* Thin Separator */}
          <div className="h-px w-16 bg-[#C8A45D] mx-auto mb-4"></div>
          
          {/* Subtext */}
          <p className="text-[#4A4036] text-lg max-w-2xl mx-auto mb-10">
            Combining academic rigor with modern publishing excellence
          </p>
        </div>

        {/* Features Grid with Overlapping Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {features.map((feature) => (
            <div key={feature.id} className="relative">
              
              {/* Overlapping Image Container */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
  <div className="flex items-center justify-center p-2">
    <img 
      src={feature.imageSrc} 
      alt=""
      // Changed w-20 to w-full/max-w-xs and object-cover to object-contain
      className="w-auto h-24 max-w-[160px] object-contain drop-shadow-md"
    />
  </div>
</div>

              {/* Feature Card with Image Overlapping Top */}
              <div className="bg-[#F6F1E8] rounded-lg pt-16 pb-8 px-6 text-center 
                            border border-[#E6DDCF]
                            shadow-sm
                            hover:shadow-md hover:shadow-[#3F2A1D]/5 
                            transition-all duration-300">
                
                {/* Heading */}
                <h3 className="font-serif text-lg text-[#3F2A1D] mb-3">
                  {feature.title}
                </h3>
                
                {/* Description - 2 lines */}
                <p className="text-[#4A4036] text-sm leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}