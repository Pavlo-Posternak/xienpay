import React from 'react';

const BalanceStats: React.FC = ({main, sub}) => {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: "24px",
        padding: "12px 24px",
        borderRadius: "12px",
        background: "white",
        boxShadow: "3px 3px 5px #1111",
      }}>
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            fontSize: "16px",
            padding: "0 24px"
        }}>
            {sub.map(item => {
                return (
                    <>
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                    </>
                );
            })}
        </div>
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            fontSize: "32px",
            fontWeight: "600"
        }}>
            <span>{main.name}</span>
            <span>{main.value}</span>
        </div>
      </div>
    );
  };
  
  export default BalanceStats;