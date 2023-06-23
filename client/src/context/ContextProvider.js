import React, { createContext, useState, useContext } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [Holdings, setHoldings] = useState();
  const [available_balance, setAvailableBalance] = useState();
  const [total_profit, setTotalProfit] = useState();

  const updateHoldings = (newValue) => {
    setHoldings(newValue);
  };
  const updateAvailableBalance = (newValue) => {
    setAvailableBalance(newValue);
  };
  const updateTotalProfit = (newValue) => {
    setTotalProfit(newValue);
  };

  return (
    <SharedStateContext.Provider
      value={{
        Holdings,
        available_balance,
        total_profit,
        updateHoldings,
        updateAvailableBalance,
        updateTotalProfit,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);
