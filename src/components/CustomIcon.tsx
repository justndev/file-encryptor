import React from 'react';
import { Image, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CustomIconProps {
  source: string;
  size?: number;
  onPress?: () => void
};

const CustomIcon = ({ source, size = 24, onPress }: CustomIconProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
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
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    tintColor: '#6b7280',
  },
});

export default CustomIcon;
