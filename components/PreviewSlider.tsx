import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Props = {
  beforeImage: string; // change to string
  afterImage: string;  // change to string
  onClose: () => void;
};

export default function PreviewSlider({ beforeImage, afterImage, onClose }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const [containerWidth, setContainerWidth] = useState(screenWidth - 40);

  const panX = useRef(new Animated.Value(containerWidth / 2)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx + containerWidth / 2;
        if (newX > 0 && newX < containerWidth) {
          panX.setValue(newX);
        }
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setContainerWidth(width);
    panX.setValue(width / 2);
  };

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      {/* ✕ Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <View style={styles.closeCircle}>
          <Text style={styles.closeText}>✕</Text>
        </View>
      </TouchableOpacity>

      {/* After Image (background) */}
      <Image
        source={afterImage ? { uri: afterImage } : require('@/assets/images/sample-after.png')}
        style={[styles.image, { width: containerWidth }]}
      />

      {/* Before Image (overlay) */}
      <Animated.View style={[styles.overlayContainer, { width: panX }]}>
        <Image
          source={beforeImage ? { uri: beforeImage } : require('@/assets/images/sample-before.png')}
          style={[styles.image, { width: containerWidth }]}
        />
      </Animated.View>

      {/* Draggable Divider */}
      <Animated.View
        style={[styles.divider, { left: Animated.subtract(panX, 1) }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    aspectRatio: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#000',
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayContainer: {
    overflow: 'hidden',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
  },
});
