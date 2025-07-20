import React from 'react';

const MapMessage = ({ route_url, distance, duration, transport_mode }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-2 max-w-xs md:max-w-md lg:max-w-lg">
      <h4 className="font-bold text-base text-dark-gray mb-2">경로 안내</h4>
      <div className="mb-2 text-sm text-dark-gray">
        <p>거리: {distance}</p>
        <p>시간: {duration}</p>
        <p>교통수단: {transport_mode}</p>
      </div>
      {route_url && (
        <div className="w-full h-64 overflow-hidden rounded-md">
          <iframe
            src={route_url}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="경로 지도"
          ></iframe>
        </div>
      )}
      {!route_url && <p className="text-red-500 text-sm">경로 URL을 불러올 수 없습니다.</p>}
    </div>
  );
};

export default MapMessage;
