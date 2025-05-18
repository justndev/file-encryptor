import React from 'react';
import { Image, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CustomIconProps {
  source: string;
  size?: number;
  onPress?: () => void;
  color?: string;
};

const CustomIcon = ({ source, size = 24, onPress, color}: CustomIconProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.iconContainer]}>
        <Image
          source={source} 
          style={[
            {tintColor: !!color ? color: '#6b7280'},
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

});

export default CustomIcon;
