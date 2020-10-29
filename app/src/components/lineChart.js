import React, { useState } from 'react';

import {
  VictoryTheme,
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
} from 'victory';

const activityTestData = [
  { x: 0, y: 1000 },
  { x: 1, y: 1200 },
  { x: 2, y: 1100 },
  { x: 3, y: 1250 },
  { x: 4, y: 1250 },
  { x: 5, y: 1280 },
  { x: 6, y: 1500 },
  { x: 7, y: 1400 },
  { x: 8, y: 2220 },
  { x: 9, y: 2150 },
  { x: 10, y: 2000 },
];

const contentTestData = [
  { x: 0, y: 800 },
  { x: 1, y: 900 },
  { x: 2, y: 1000 },
  { x: 3, y: 900 },
  { x: 4, y: 1250 },
  { x: 5, y: 1320 },
  { x: 6, y: 1800 },
  { x: 7, y: 1200 },
  { x: 8, y: 1300 },
  { x: 9, y: 2150 },
  { x: 10, y: 1900 },
];

const subscriberTestData = [
  { x: 0, y: 200 },
  { x: 1, y: 220 },
  { x: 2, y: 240 },
  { x: 3, y: 260 },
  { x: 4, y: 290 },
  { x: 5, y: 345 },
  { x: 6, y: 400 },
  { x: 7, y: 500 },
  { x: 8, y: 700 },
  { x: 9, y: 800 },
  { x: 10, y: 1000 },
];

function LineChart({ userData, stats }) {
  const [activityData] = useState(activityTestData || []);
  const [contentData] = useState(contentTestData || []);
  const [subscriberData] = useState(subscriberTestData || []);

  // const globalLine = buildLineData(stats.global_avg, data.length);
  // const globalArea = buildAreaData(
  //   stats.global_avg,
  //   stats.global_StdDev,
  //   data.length
  // );
  const globalLine = buildLineData(1200, contentData.length);
  const globalArea = buildAreaData(1200, 425, contentData.length);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      height={150}
      domainPadding={{ x: 0, y: 10 }}
      padding={{ top: 10, bottom: 18, left: 35 }}
    >
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        tickFormat={['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4', 'Q1']}
        style={{
          axis: { stroke: '#aaa', strokeWidth: 1 },
          tickLabels: {
            fontSize: 6,
            padding: 4,
            fill: '#888',
            fontFamily: 'Libre Baskerville',
          },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `$${x / 1000}k`}
        theme={VictoryTheme.material}
        style={{
          axis: { stroke: '#aaa', strokeWidth: 1 },
          tickLabels: {
            fontSize: 6,
            padding: 4,
            fill: '#888',
            fontFamily: 'Libre Baskerville',
          },
        }}
      />

      <VictoryArea
        data={globalArea}
        style={{
          data: {
            fill: '#f3f6f6',
            fillOpacity: 0.4,
          },
        }}
      />
      <VictoryLine
        data={globalLine}
        interpolation="natural"
        style={{
          data: {
            stroke: '#f3f6f6',
            strokeWidth: 2,
          },
        }}
      />

      <VictoryLine
        data={activityData}
        interpolation="natural"
        style={{
          data: {
            stroke: '#FF7579',
            strokeWidth: 2,
          },
        }}
      />

      <VictoryLine
        data={contentData}
        interpolation="natural"
        style={{
          data: {
            stroke: '00b0ff',
            strokeWidth: 2,
          },
        }}
      />

      <VictoryLine
        data={subscriberData}
        interpolation="natural"
        style={{
          data: {
            stroke: '#4DBA62',
            strokeWidth: 2,
          },
        }}
      />
    </VictoryChart>
  );
}

export default LineChart;

function buildLineData(average, length) {
  // console.log(average, stdDev, length);
  // const max = average + stdDev;
  // const min = average - stdDev;

  const data = Array.from({ length: length }, (item, index) => {
    return {
      x: index,
      y: average,
    };
  });

  // console.log(data);
  return data;
}

function buildAreaData(average, stdDev, length) {
  // console.log(average, stdDev, length);

  const max = average + stdDev;
  const min = average - stdDev;

  const data = Array.from({ length: length }, (item, index) => {
    return {
      x: index,
      y0: min,
      y: max,
    };
  });

  // console.log(data);
  return data;
}
