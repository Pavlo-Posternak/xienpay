import React from 'react';

const ChartHeader: React.FC = ({lastHour, lastDay}) => {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 40px",
        justifyContent: "space-between"
      }}>
        <span style={{fontSize: "28px", fontWeight: "800"}}>DEPOSITS</span>
        <div>
            <span style={{color:"black", fontSize: "20px"}}>${lastHour.deposit_amount ?? 0}</span>
            <span style={{fontSize: "12px", display: "block", marginTop: "8px"}}>LAST HOUR</span>
        </div>
        <div>
            <span style={{color:"black", fontSize: "20px"}}>{lastHour.deposit_count ?? 0}</span>
            <span style={{fontSize: "12px", display: "block", marginTop: "8px"}}>Count</span>
        </div>
        <div>
            <span style={{color:"red", fontSize: "20px"}}>${lastDay.deposit_amount ?? 0}</span>
            <span style={{fontSize: "12px", display: "block", marginTop: "8px"}}>24H Change</span>
        </div>
      </div>
    );
  };
  
  export default ChartHeader;