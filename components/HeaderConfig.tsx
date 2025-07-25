// components/HeaderConfig.tsx
import { Stack } from 'expo-router';
import { Image, View } from 'react-native';

export default function HeaderConfig({ title }: { title: string }) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title,
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: {
          fontFamily: 'InterExtraBold',
          fontSize: 32,
          color: '#D11315',
          marginTop: -30,
        },
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Image
              source={require('@/assets/images/border.png')}
              style={{
                width: '100%',
                height: 20,
                resizeMode: 'stretch',
                position: 'absolute',
                bottom: 0,
              }}
            />
          </View>
        ),
      }}
    />
  );
}
