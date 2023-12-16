import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeartButton from "./HeartButton";
import ImageCarousel from "./ImageCarousel";
import {
  getDocs,
  collection,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import { RefreshControl } from "react-native-gesture-handler";
import SPACINGS from "../../../config/SPACINGS";
import FONTSIZES from "../../../config/FONTSIZES";
import COLORS from "../../../config/COLORS";
import SustainabilityRating from "./SustainabilityRating";
import CATEGORIES from "../../../config/CATEGORIES";
import { useAuthState } from "react-firebase-hooks/auth";

interface ExploreItemCarouselProps {
  collectionName: string;
  items?: DocumentData[];
  navigation: NativeStackNavigationProp<any>;
  isFavourite?: boolean;
}

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const cardWidth: number = width * 0.8;
const cardHeight: number = height * 0.6;

function ExploreItemCarousel({
  navigation,
  collectionName,
  items,
  isFavourite,
}: ExploreItemCarouselProps) {
  const [dbItems, setDbItems] = React.useState<DocumentData[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const isAccommodation = collectionName === CATEGORIES[0].dbName;
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [userFavouritedItems, setUserFavouritedItems] = useState<String[]>([]);

  async function fetchData() {
    const profileRef = doc(firestore, "users", user?.uid as any);
    const userProfile = await getDoc(profileRef);
    const currUserDoc = userProfile.data();
    const userSavedAccommodationIDs =
      currUserDoc?.favouritedAccommodations ?? [];
    const userSavedExperienceIDs = currUserDoc?.favouritedExperiences ?? [];
    const userSavedIDs = userSavedAccommodationIDs.concat(
      userSavedExperienceIDs
    );
    setUserFavouritedItems(userSavedIDs);
    if (!items) {
      const currItems: DocumentData[] = [];
      const querySnapshot = await getDocs(
        collection(firestore, collectionName)
      );
      querySnapshot.docs.forEach((doc) => {
        currItems.push(doc.data());
      });
      setDbItems(currItems);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    fetchData();
    if (items) {
      setDbItems(items);
    }
  }, [collectionName]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginVertical: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    >
      {dbItems.map((item, index) => (
        <View key={index}>
          <View style={styles.heartButtonContainer}>
            {isAccommodation && (
              <SustainabilityRating
                numFeatures={item.sustainabilityFeatures?.length ?? 0}
              />
            )}
            <HeartButton
              listingCollection={collectionName}
              item={item}
              defaultState={
                isFavourite ?? userFavouritedItems.includes(item.firestoreID)
              }
            />
          </View>

          <View style={styles.card}>
            <Pressable
              style={styles.descriptionBackground}
              onPress={() =>
                navigation.navigate("Detail", {
                  item: item,
                  listingCollection: collectionName,
                  navigation: navigation,
                })
              }

              // Uncomment this section to see the Gallery view
              // navigation.navigate("Gallery", {
              //   item: item,
              //   navigation: navigation,
              // })}
            >
              <View style={styles.descriptionContainer}>
                <View style={styles.titleContainer}>
                  <Text
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {" "}
                    {item.title}{" "}
                  </Text>
                </View>
                <Text style={styles.price}>
                  ${item.price}
                  {isAccommodation && (
                    <Text style={[styles.price, { fontSize: 14 }]}>
                      {" "}
                      / night
                    </Text>
                  )}
                  {!isAccommodation && (
                    <Text style={[styles.price, { fontSize: 14 }]}> / pax</Text>
                  )}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("Detail", {
                  item: item,
                  listingCollection: collectionName,
                  navigation: navigation,
                })
              }
            >
              <ImageCarousel
                width={cardWidth}
                height={cardHeight}
                imagesToShow={item.images}
                navigation={navigation}
                item={item}
                page={false}
              />
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default ExploreItemCarousel;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardHeight,
    overflow: "hidden",
    borderRadius: SPACINGS.XL,
    marginVertical: SPACINGS.MD,
  },

  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
  },

  title: {
    fontSize: FONTSIZES.XL,
    fontFamily: "Bitter-Bold",
    color: COLORS.WHITE,
    flexWrap: "wrap",
  },

  price: {
    fontSize: FONTSIZES.XL,
    fontFamily: "Bitter-Bold",
    color: COLORS.WHITE,
  },

  descriptionContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACINGS.MD,
    width: "100%",
    height: 88,
  },

  descriptionBackground: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "100%",
    height: 88,
    backgroundColor: COLORS.PRIMARY,
  },

  heartButtonContainer: {
    position: "absolute",
    zIndex: 1,
    padding: 10,
    width: "100%",
    justifyContent: "space-between",
  },
});
