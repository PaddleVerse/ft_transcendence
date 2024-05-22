'use client';
import React, { useEffect, useState } from 'react';

export function Dropdown({list} : any) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
  return (
    <div className="relative">
    <button
      onClick={toggle}
      data-dropdown-toggle="dropdownDots"
      className="inline-flex items-center p-2 text-sm font-medium text-center rounded-lg text-white bg-black hover:bg-secondaryColor"
      type="button"
    >
       <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
    </svg>
      </button>
      <div className={`absolute z-10 rounded-lg shadow w-44 bg-black ${isOpen ? "right-0" : "hidden -right-full"}`}>
        {
          list.map((item: any, index: number) => {
            return (
              <button
                key={index}
                onClick={(e) => {toggle(); item.action(e)}}
                className="py-2 px-4 w-full text-sm hover:bg-secondaryColor text-gray-200">
                {item.name}
              </button>
            )
          })
        }
      </div>
    </div>
  )
}
