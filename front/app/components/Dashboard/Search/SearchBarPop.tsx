'use client';
import React, { use, useEffect, useState } from 'react'
import UserSearchCard from './UserSearchCard'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../../Sign/GlobalState';
import { debounce } from 'lodash';
import { fetchData, ipAdress } from '@/app/utils';

const SearchBarPop = () => {
    const router = useRouter();
    const { state } = useGlobalState();
    const { user } = state;

    const [isfocus , setIsFocus] = useState(false);
    const [users , setUsers] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const [searchedUsers, setSearchedUsers] = useState<any>([]);
    const [is , setIs] = useState(false);
    const [title , setTitle] = useState('Recent Searches');


    const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value.trim());
      setTitle('Search Results');
    };

    const filterUsers = (inputValue : string) => {
      setTimeout(() => {
        if (user?.id === undefined) return;
        fetchData(`/search/${inputValue}/${user?.id}`, 'GET', null)
        .then((res: any) => {
          if (!res) return;
          setFilteredUsers(res.data);
        })
        .catch((err) => {});
      }, 100);
    }

    useEffect(() => {
        if (inputValue === '') 
        {
          setFilteredUsers(searchedUsers);
          setIs((prev) => !prev)
          setTitle('Recent Searches');
          return;
        }
        filterUsers(inputValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [inputValue])

    useEffect(() => {
      fetchData(`/search/searchedUsers/${user?.id}`, 'GET', null)
      .then((res: any) => {
        if (!res) return;
        setSearchedUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => {});
    }, [users, is])

    useEffect(() => {
        fetchData('/user', 'GET', null)
        .then((res: any) => {
          if (!res) return;
          setUsers(res.data?.filter((u : any) => u?.id !== user?.id));
        })
        .catch((err) => {});
    } , [user?.id])

    const handleclick = (id : any) => {
      fetchData(`/search`, 'POST', { userId: id, searchingUserId: user?.id })
      .catch((err) => {});
      if (id === user?.id) {
        router.push(`/Dashboard`);
        return;
      }
      router.push(`/Dashboard/Profile?id=${id}`);
    }

  return (
    <div className=' flex justify-center items-center flex-col '>
        <input
            className='w-[90%] z-40 h-14 p-6 text-sm border-none text-white rounded-xl mt-10 bg-[#263850] shadow-xl focus:outline-none focus:ring-[1px] focus:ring-red-400/[0.5] transition duration-300 ease-in-out placeholder:text-gray-400'
            type='text'
            placeholder='Look for other gamers!'
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 150)}
            onChange={handleInputChange}
        />
        {isfocus && (
            <div className="absolute top-0 w-[80%] xl:h-[35%] h-[50%] rounded-md z-40 mt-28 p-4 no-scrollbar overflow-y-scroll" 
            style={{
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(38, 56, 80, 0.7)",
              scrollBehavior: 'smooth'
            }}>
                <div>
                    <h1 className='text-white text-xl my-4 ml-2'>{title}</h1>
                    <div className='flex justify-start items-start flex-wrap'>
                        { filteredUsers && filteredUsers?.map((user : any, index : any) => (
                            <UserSearchCard user={user} key={index} handleClick={handleclick}/>
                        ))
                        }
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default SearchBarPop