import React from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const TradingViewChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <TradingViewWidget
      symbol={`${symbol}`}  // Adjust this based on your token and trading pair
      interval="D"  // Set the default interval (Daily)
      theme={Themes.DARK}  // Choose DARK or LIGHT based on your app's theme
      locale="en"
      height={500}  // Specify the desired height
      width="100%"  // Specify the desired width, you can use a percentage or a fixed value

      autosize={false}  // Disable autosize to use the specified width and height
    />
  );
};

export default TradingViewChart;
