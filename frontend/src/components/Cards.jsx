import React, { useEffect, useState } from "react";

const Cards = ({cardonename , cardtwoname , data1, data2}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Revenue Card */}
      <article className="w-full sm:w-1/2 md:w-1/3 rounded-lg border border-gray-100 bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{cardonename}</p>
            <p className="text-2xl font-medium text-gray-900 mt-1">{data1}</p>
          </div>
          <span className="rounded-full bg-blue-100 p-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">{cardtwoname}</p>
      </article>

      {/* Sales Amount Card */}
      <article className="w-full sm:w-1/2 md:w-1/3 rounded-lg border border-gray-100 bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{cardtwoname}</p>
            <p className="text-2xl font-medium text-gray-900 mt-1">{data2}</p>
          </div>
          <span className="rounded-full bg-green-100 p-3 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2z"
              />
            </svg>
          </span>
        </div>
      </article>
    </div>
  );
};

export default Cards;
