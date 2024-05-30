import React from 'react';
import TimeSelection from './TimeSelection';
import ChartHeader from './ChartHeader';
import Graph from './Graph';

const graphData = [
    {
        name:"10:00",
        channel1: 234,
        channel2: 61,
    },
    {
        name:"10:30",
        channel1: 45,
        channel2: 672,
    },
    {
        name:"11:00",
        channel1: 221,
        channel2: 752,
    },
    {
        name:"11:30",
        channel1: 32,
        channel2: 912,
    },
    {
        name:"12:00",
        channel1: 123,
        channel2: 189,
    },
    {
        name:"12:30",
        channel1: 340,
        channel2: 95,
    },
    {
        name:"13:00",
        channel1: 21,
        channel2: 732,
    },
    {
        name:"13:30",
        channel1: 450,
        channel2: 372,
    },
    {
        name:"14:00",
        channel1: 221,
        channel2: 561,
    },
    {
        name:"14:30",
        channel1: 320,
        channel2: 238,
    },
    {
        name:"15:00",
        channel1: 620,
        channel2: 157,
    },
    {
        name:"15:30",
        channel1: 195,
        channel2: 486,
    },
]

const TrackingChart: React.FC = () => {
    return (
      <div style={{
        borderRadius: "12px",
        background: "white",
        boxShadow: "3px 3px 5px #1111",
        padding: "20px"
      }}>
        <ChartHeader />
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            marginTop: "20px",
        }}>
            <div style={{
                width: "calc(100% - 76px)",
                height: "320px"
            }}>
                <Graph graphData={graphData}/>
            </div>
            <TimeSelection value={"1D"} options={["12H", "1D", "7D", "15D"]}/>
        </div>
      </div>
    );
  };
  
  export default TrackingChart;