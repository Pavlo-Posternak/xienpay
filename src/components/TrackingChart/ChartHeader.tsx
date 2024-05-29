import React from 'react';

const ChartHeader: React.FC = () => {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 32px 24px",
        justifyContent: "space-between"
      }}>
        <span style={{fontSize: "28px", fontWeight: "800"}}>DEPOSITS</span>
        <div>
            <p style={{color:"black", fontSize: "20px"}}>48.550</p>
            <p style={{fontSize: "12px"}}>LAST HOUR</p>
        </div>
        <div>
            <p style={{color:"black", fontSize: "20px"}}>653</p>
            <p style={{fontSize: "12px"}}>Count</p>
        </div>
        <div>
            <p style={{color:"red", fontSize: "20px"}}>$48.550</p>
            <p style={{fontSize: "12px"}}>24H Change</p>
        </div>
      </div>
    );
  };
  
  export default ChartHeader;