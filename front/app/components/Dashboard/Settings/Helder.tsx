'use client';
import { Tabs } from "@/components/ui/tabs";
import { useState } from 'react';
import EditProfile from './EditProfile';
import Security from './Security';

const Helder = () => {
  const [current, setCurrent] = useState('My profile');
  const tabs = [
    {
      title: "My profile",
      value: "My profile",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-[#192536]">
          <EditProfile />
        </div>
      ),
    },
    {
      title: "Security",
      value: "Security",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-[#192536]">
          <Security />
        </div>
      ),
    }
  ];
  return (
    <div className="h-[90%] w-[94%] rounded-md [perspective:1000px] relative flex flex-col items-center bg-[#101823]">
      <Tabs tabs={tabs} />
    </div>
  )
}

export default Helder