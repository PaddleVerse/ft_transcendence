"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { PointElement, LineElement } from "chart.js";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import axios from "axios";
import { fetchData, ipAdress } from "@/app/utils";
import { set } from "lodash";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const LineChart = () => {
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({
    labels: [],
    datasets: [{
      label: "Player Data",
      data: [],
      backgroundColor: "#4CAF50",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    }],
  });
  
  useEffect(() => {
    fetchData(`/match/history/${user?.id}`, "GET", null)
      .then((res:any) => {
        if (!res) return;
        setData(res.data?.reverse());
      }).catch((error) => {});
  }, [state]);

  useEffect(() => {
    const userWins:number[] = [0]
    if (data && data.length > 0) {
      data.reduce((acc, curr) => {
        if (curr.winner === user.id) {
          userWins.push(acc + 1);
          return acc + 1;
        } else {
          userWins.push(acc - 1);
          return acc - 1;
        }
      }, 0);
    }
    const container:any = [];
    userWins.forEach((win, index) => {
      container.push({
        userId: user?.id,
        win: win,
      });
    })
    setStats(container);
  }, [data]);

  useEffect(() => {
    setUserData({
      labels: stats.map((data, index) => index + 1),
      datasets: [
        {
          label: "Player Data",
          data: stats.map((data) => data.win),
          backgroundColor: "#4CAF50",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
    });
  }, [stats]);

  return (
    <>
    {<Line
      data={userData}
      options={{
        aspectRatio: 10,
        responsive: true,
        maintainAspectRatio: false,
        
        scales: {
          x: {
            display: true,
            // title: {
            //   display: true,
            //   text: "Number of Games",
            // },
          },
          y: {
            display: true,
            ticks: {
              precision: 0,
            }
            // title: {
            //   display: true,
            //   text: "Wins",
            // }
          },
        },
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
      }}
    />}
    </>
  );
};

export default LineChart;
