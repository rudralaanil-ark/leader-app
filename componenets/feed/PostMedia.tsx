import Colors from "@/data/Colors";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = width * 0.78;

export default function PostMedia({ images = [] }: any) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const onScroll = (e: any) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(slide);
  };

  return (
    <View style={styles.wrapper}>
      {/* <FlatList
        data={images}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        keyExtractor={(_, i) => "img-" + i}
      /> */}

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        keyExtractor={(_, i) => "img-" + i}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, index === i && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width,
    height: IMG_HEIGHT,
    backgroundColor: Colors.surface,
    marginTop: 10,
  },
  image: {
    width,
    height: IMG_HEIGHT,
  },
  dots: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.iconInactive,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
});
