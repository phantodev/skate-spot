import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const windowWidth = Dimensions.get('window').width;

export default function TabTwoScreen() {
  const [data, setData] = React.useState(["Slide 1", "Slide 2", "Slide 3"])

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Carousel
          loop
          width={windowWidth}
          height={200}
          autoPlay={false}
          data={data}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 40,
            parallaxAdjacentItemScale: 0.8,
          }}
          defaultIndex={0}
          enabled={true}
          renderItem={({ item, animationValue }) => (
            <View style={{
              flex: 1,
              backgroundColor: "dodgerblue",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
            }}>
              <Text style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
              }}>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
