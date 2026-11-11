import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const height = 80;
const tabCenters = [
  width * 0.173,
  width * 0.388,
  width * 0.605,
  width * 0.823,
];

const AnimatedPath = Animated.createAnimatedComponent(Path);

type TabButtonProps = {
  Icon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  isFocused: boolean;
  label: string;
  onPress: () => void;
};

const TabButton = ({ Icon, isFocused, label, onPress }: TabButtonProps) => {
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(isFocused ? -10 : 0, { duration: 300 }) }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedIconStyle}>
        {Icon?.({
          color: isFocused ? '#D50000' : '#fff',
          focused: isFocused,
          size: 24,
        })}
      </Animated.View>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomBottomBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const activeIndex = state.index;

  const centerX = useSharedValue(tabCenters[activeIndex]);

  useEffect(() => {
    centerX.value = withTiming(tabCenters[activeIndex], { duration: 300 });
  }, [activeIndex, centerX]);

  const animatedProps = useAnimatedProps(() => {
    const cx = centerX.value;
    const leftEdge = cx - 60;
    const leftCurveStart = leftEdge + 40;
    const leftCurveControl = cx - 35;

    const rightCurveControl = cx + 35;
    const rightCurveEnd = cx + 60 - 40;
    const rightEdge = cx + 60;

    return {
      d: `
        M0,0 
        H${leftEdge} 
        C${leftCurveStart},0 ${leftCurveControl},40 ${cx},40
        C${rightCurveControl},40 ${rightCurveEnd},0 ${rightEdge},0 
        H${width} 
        V${height} 
        H0 
        Z
      `,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Svg
        width={width}
        height={120}
        viewBox={`0 0 ${width} 120`}
        style={styles.fadeSvg}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#F2F2F2" stopOpacity="0" />
            <Stop offset="100%" stopColor="#F2F2F2" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={120} fill="url(#bottomFade)" />
      </Svg>

      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
        <AnimatedPath fill="#D50000" animatedProps={animatedProps} />
      </Svg>

      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = options.tabBarIcon;
          const label = typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

          return (
            <TabButton
              key={route.key}
              Icon={Icon}
              isFocused={isFocused}
              label={label}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  fadeSvg: {
    position: 'absolute',
    bottom: 40,
    zIndex: 0,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    height,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    width: 70,
  },
  label: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
  },
  labelFocused: {
    color: '#fff',
  },
});

export default CustomBottomBar;
