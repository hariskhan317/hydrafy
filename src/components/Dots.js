import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Dots({ step, total = 9 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i === step;
        return (
          <View
            key={i}
            style={{
              width: on ? 22 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: on ? COLORS.sky[500] : COLORS.ink[300],
            }}
          />
        );
      })}
    </View>
  );
}
