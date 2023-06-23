import React, { createContext, useState, useContext } from 'react';

const SharedStateContext = createContext();

const SharedStateProvider = ({ children }) => {
  const [Holdings, setHoldings] = useState(1);
  const [available_balance, setAvailableBalance] = useState(1);
  const [total_profit, setTotalProfit] = useState(1);

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
    <SharedStateContext.Provider value={{ Holdings, available_balance, total_profit, updateHoldings, updateAvailableBalance, updateTotalProfit }}>
      {children}
    </SharedStateContext.Provider>
  );
};

const Component1 = () => {
  const { Holdings, updateHoldings } = useContext(SharedStateContext);

  console.log('Rendering Component1');
  const handleUpdate = () => {
    updateHoldings(Holdings + 1);
  };

  return (
    <div>
      <h2>Component1</h2>
      <button onClick={handleUpdate}>Update State1</button>
      <p>State1: {Holdings}</p>
    </div>
  );
};

const Component2 = () => {
  const { updateAvailableBalance, available_balance } = useContext(SharedStateContext);
  console.log('Rendering Component2');

  const handleUpdate = () => {
    updateAvailableBalance(available_balance + 1);
  };

  return (
    <div>
      <h2>Component2</h2>
      <button onClick={handleUpdate}>Update AvailableBalance</button>
      <p>AvailableBalance: {available_balance}</p>
    </div>
  );
};

const MainComponent = () => {
  return (
    <SharedStateProvider>
      <div>
        <Component1 />
        <Component2 />
      </div>
    </SharedStateProvider>
  );

};

export default MainComponent;
