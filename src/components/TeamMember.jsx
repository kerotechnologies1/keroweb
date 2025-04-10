import React from 'react';

const TeamMember = ({ name, position, image }) => {
  return (
    <div className="swiper-slide px-2">
      <div className="card bg-transparent border-none">
        <div className="global-img rounded-lg overflow-hidden">
          <img 
            src={image} 
            className="card-img-top w-full h-64 object-cover" 
            alt={name} 
          />
        </div>
        <div className="card-body text-center py-4">
          <h5 className="card-title text-2xl mb-1 font-medium">{name}</h5>
          <p className="card-text text-sm text-gray-600">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;