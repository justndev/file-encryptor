import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface CustomIconProps {
  source: string;
  size: number;
  onPress?: () => void
};

const CustomIcon = ({ source, size = 24, onPress }: CustomIconProps) => {
  return (
    <View style={[styles.iconContainer]}>
      <Image
        source={source}
        style={[
          styles.icon,
          {
            width: size,
            height: size,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    tintColor: '#6b7280', // Default gray color, can be overridden via style prop
  },
});

export default CustomIcon;