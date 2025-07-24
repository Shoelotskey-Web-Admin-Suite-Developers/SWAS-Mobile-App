import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const height = 80;

const CustomBottomBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const tabCount = state.routes.length;
    const activeIndex = state.index;
    const tabWidth = width / tabCount;
    // Manually define the centerX for each tab
    const tabCenters = [
    width * 0.173,  // Position for tab 0 (e.g. left-most)
    width * 0.388,  // Position for tab 1
    width * 0.605,  // Position for tab 2
    width * 0.823,  // Position for tab 3 (e.g. right-most)
    ];

    // Set centerX based on active tab
    const centerX = tabCenters[activeIndex];

    const leftEdge = centerX - 60;
    const leftCurveStart = leftEdge + 40;
    const leftCurveControl = centerX - 35;

    const rightCurveControl = centerX + 35;
    const rightCurveEnd = centerX + 60 - 40;
    const rightEdge = centerX + 60;

  return (
    <View style={styles.wrapper}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
        <Path
          fill="#D50000"
          d={`
            M0,0 
            H${leftEdge} 
            C${leftCurveStart},0 ${leftCurveControl},40 ${centerX},40
            C${rightCurveControl},40 ${rightCurveEnd},0 ${rightEdge},0 
            H${width} 
            V${height} 
            H0 
            Z
          `}
        />
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
          const label = options.tabBarLabel ?? options.title ?? route.name;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                    styles.tabButton,
                    isFocused && styles.activeTabButton,
                ]}
              activeOpacity={0.8}
            >
                <View style={[styles.iconWrapper, isFocused && styles.iconElevated]}>
                    {Icon && Icon({ color: isFocused ? '#D50000' : '#ccc', focused: isFocused })}
                </View>
                <Text style={[styles.label, isFocused && styles.labelFocused]}>
                    {label}
                </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        },

    iconElevated: {
        transform: [{ translateY: -10 }],
        },
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    svg: {
        position: 'absolute',
        bottom: 0,
    },
    tabContainer: {
        flexDirection: 'row',
        height,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        width: 70,
    },
    label: {
        fontSize: 10,
        color: '#ccc',
        marginTop: 4,
    },
    labelFocused: {
        color: '#fff',
    },
});

export default CustomBottomBar;
