import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Box } from '@chakra-ui/react';

const TradingViewChart = ({ candleData, precision=7, showSMA8, showSMA21 }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleSeriesRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const sma8SeriesRef = useRef(null);
    const sma21SeriesRef = useRef(null);
    const legendRef = useRef(null);

    useEffect(() => {
      if (!chartContainerRef.current) {return;}
  
      // Chart Options
      const chartOptions = {
          layout: {
              textColor: '#D9D9D9',
              background: { type: 'solid', color: '#151924' },
          },
          rightPriceScale: {
              borderVisible: false,
              priceFormat: {
                  type: 'price',
                  precision, 
                  minMove: Math.pow(10, -precision), 
              },
          },
          grid: {
              vertLines: {
                  color: 'rgba(197, 203, 206, 0.05)', 
                  visible: true,
              },
              horzLines: {
                  color: 'rgba(197, 203, 206, 0.05)', 
                  visible: true,
              },
          },
      };
  
      // Create Chart
      chartRef.current = createChart(chartContainerRef.current, chartOptions);
  
      // Candlestick Series
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#ffffff',
          downColor: '#ef5350',
          borderVisible: true,
          wickUpColor: '#ef5350',
          wickDownColor: '#ef5350',
          priceFormat: {
              type: 'price',
              precision:7, 
              minMove: 0.0000001,
          },
      });
      
      // Volume Series as Overlay
      volumeSeriesRef.current = chartRef.current.addHistogramSeries({
          color: '#26a69a',
          priceFormat: {
              type: 'volume',
          },
          priceScaleId: '', 
      });
  
      // Set Positioning for the Volume Series
      volumeSeriesRef.current.priceScale().applyOptions({
          scaleMargins: {
              top: 0.7,
              bottom: 0,
          },
      });
  
      // Create Legend
      const legend = document.createElement('div');
      legend.style.position = 'absolute';
      legend.style.top = '10px';
      legend.style.left = '12px';
      legend.style.zIndex = '1000';
      legend.style.color = '#D9D9D9';
      legend.style.fontFamily = 'Trebuchet MS, Roboto, Ubuntu, sans-serif';
      legend.style.fontSize = '14px';
      legend.style.pointerEvents = 'none';
      chartContainerRef.current.appendChild(legend);
      legendRef.current = legend;
  
      // Crosshair Move Event for Legend
      const updateLegend = (param) => {
          if (!param.time || !param.point) {
              legendRef.current.innerHTML = '';
              return;
          }
  
          const dataAtTime = candleData.find((d) => Math.floor(d.time) === param.time);
          if (dataAtTime) {
              const dateStr = new Date(dataAtTime.time * 1000).toLocaleString();
              legendRef.current.innerHTML = `
                  <div><strong>${dateStr}</strong></div>
                  <div>Open: ${dataAtTime.open.toFixed(precision)}</div>
                  <div>High: ${dataAtTime.high.toFixed(precision)}</div>
                  <div>Low: ${dataAtTime.low.toFixed(precision)}</div>
                  <div>Close: ${dataAtTime.close.toFixed(precision)}</div>
                  <div>Volume: ${dataAtTime.volume.toFixed(2)}</div>
              `;
          } else {
              legendRef.current.innerHTML = '<div>No data available</div>';
          }
      };
  
      // Subscribe to crosshair move
      chartRef.current.subscribeCrosshairMove(updateLegend);
  
      // eslint-disable-next-line consistent-return
      return () => {
          chartRef.current.remove(); 
          chartRef.current = null;
          candleSeriesRef.current = null;
          volumeSeriesRef.current = null;
          sma8SeriesRef.current = null;
          sma21SeriesRef.current = null;
          if (legendRef.current) {
              legendRef.current.remove();
              legendRef.current = null;
          }
      };
  }, [precision, candleData]); 
  
  

    // Update Chart Data and Moving Averages
    
    // eslint-disable-next-line
    useEffect(() => {
        if (candleSeriesRef.current && candleData.length) {
            const sortedData = [...candleData].sort((a, b) => a.time - b.time);
            const formattedData = sortedData.map((item) => ({
                time: Math.floor(item.time),
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
            }));

            // Update Candlestick Series Data
            candleSeriesRef.current.setData(formattedData);

            // Update Volume Series Data
            if (volumeSeriesRef.current) {
                const volumeData = formattedData.map((item) => ({
                    time: item.time,
                    value: item.volume,
                    color: item.close >= item.open ? '#26a69a' : '#ef5350', 
                }));
                volumeSeriesRef.current.setData(volumeData);
            }

            // Update SMA8
            if (showSMA8) {
                if (!sma8SeriesRef.current) {
                    sma8SeriesRef.current = chartRef.current.addLineSeries({
                        color: '#2196F3',
                        lineWidth: 1,
                    });
                }
                const sma8Data = calculateSMA(formattedData, 8);
                sma8SeriesRef.current.setData(sma8Data);
            } else {
                if (sma8SeriesRef.current) {
                    chartRef.current.removeSeries(sma8SeriesRef.current);
                    sma8SeriesRef.current = null;
                }
            }

            // Update SMA21
            if (showSMA21) {
                if (!sma21SeriesRef.current) {
                    sma21SeriesRef.current = chartRef.current.addLineSeries({
                        color: '#FF9800',
                        lineWidth: 1,
                    });
                }
                const sma21Data = calculateSMA(formattedData, 21);
                sma21SeriesRef.current.setData(sma21Data);
            } else {
                if (sma21SeriesRef.current) {
                    chartRef.current.removeSeries(sma21SeriesRef.current);
                    sma21SeriesRef.current = null;
                }
            }
        }
    }, [candleData, showSMA8, showSMA21]);

    return (
        <Box position="relative">
            <div
                ref={chartContainerRef}
                style={{
                    width: '100%',
                    height: '90vh',
                    backgroundColor: '#151924',
                    border: '1px solid #3f444e',
                    position: 'relative',
                }}
            />
        </Box>
    );
};

// Utility Function for SMA Calculation
const calculateSMA = (data, period) => {
    const smaData = [];
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].close;
        if (i >= period - 1) {
            if (i >= period) {
                sum -= data[i - period].close;
            }
            smaData.push({
                time: data[i].time,
                value: sum / period,
            });
        }
    }
    return smaData;
};

export default TradingViewChart;
