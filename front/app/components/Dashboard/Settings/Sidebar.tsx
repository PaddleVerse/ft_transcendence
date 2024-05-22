import React from 'react';

const Sidebar = ({current, setCurrent} : any) => {
  return (
    <div className="lg:w-64 lg:h-[100%] h-[10%] w-full text-white flex flex-row lg:flex-col justify-start p-4 lg:border-r-[0.5px] border-white">
      <nav className=''>
        <ul className=" font-sans flex gap-4 flex-row lg:flex-col items-center mt-4">
          <li>
              <button 
                onClick={() => setCurrent('My profile')}
                className={`hover:bg-[#5b565453] lg:px-10 lg:text-lg px-5 text-sm py-2 rounded-3xl transition duration-200 ${current === 'My profile' ? 'bg-[#5b565453]' : ''}`}
              >
                My profile
              </button>
          </li>
          <li>
              <button 
                onClick={() => setCurrent('Security')}
                className={`hover:bg-[#5b565453] lg:px-10 lg:text-lg px-5 text-sm py-2 rounded-3xl transition duration-200 ${current === 'Security' ? 'bg-[#5b565453]' : ''}`}
              >
                Security
              </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
