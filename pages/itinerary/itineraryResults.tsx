import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import COLORS from "../../config/COLORS";
import SPACINGS from "../../config/SPACINGS";
import H1 from "../../custom_components/typography/H1";
import { TripInputsContext } from "./components/TripInputsContext";
import BodyText from "../../custom_components/typography/BodyText";
import { Tab, TabView } from "@rneui/themed";
import H3 from "../../custom_components/typography/H3";
import { ScrollView } from "react-native-gesture-handler";
import {
  getAccommodationOption,
  getExperiencesOptions,
} from "./functions/itineraryGenerationHelper";
import { DocumentData } from "firebase/firestore";
import ExploreItemCarousel from "../explore/components/ExploreItemCarousel";
import CATEGORIES from "../../config/CATEGORIES";

interface ItineraryResultsProps {
  navigation: NativeStackNavigationProp<any>;
}

const width = Dimensions.get("window").width;

function ItineraryResults({ navigation }: ItineraryResultsProps) {
  const { tripLength, tripPax, tripBudget, tripInterests, tripPreferences } =
    React.useContext(TripInputsContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = React.useState(0);
  const [indicatorX, setIndicatorX] = useState(0); // for fixing translateX bug with tab component
  const tabWidth = width / 3;
  const [accommodation, setAccommodation] = useState<DocumentData | undefined>(
    undefined
  );
  const [experiences, setExperiences] = useState<DocumentData[] | undefined>(
    undefined
  );

  async function fetchAccommodation() {
    const newAccommodation = await getAccommodationOption(
      tripBudget,
      tripInterests
    );
    setAccommodation(newAccommodation);
  }
  async function fetchExperiences() {
    const newExperiences = await getExperiencesOptions(
      tripBudget,
      tripInterests
    );
    setExperiences(newExperiences);
    setLoading(false);
  }

  // Database tasks:
  // TODO: fetch filtered options from accommodation database
  useEffect(() => {
    fetchAccommodation();
  }, []);
  // TODO: fetch filtered options from activity database
  useEffect(() => {
    fetchExperiences();
  }, []);

  // Logic tasks:
  // TODO: get timetable start and end timings
  // TODO: get no. of activities per day

  // AI tasks:
  // TODO: get duration and time of day for each activity from AI (morning, afternoon, evening)
  // TODO: get AI generated itinerary summary

  return (
    <SafeAreaView style={styles.background}>
      {loading && (
        <View style={styles.container}>
          <H1 style={{ textAlign: "center" }}>
            Hang tight while we plan your trip!
          </H1>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <BodyText
              style={{ textAlign: "center", marginBottom: SPACINGS.LG }}
            >
              We'll be done in just a moment...
            </BodyText>
            <View style={styles.stepsContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          </View>
        </View>
      )}
      {!loading && (
        <View style={[styles.container, { margin: 0 }]}>
          <H1 style={{ textAlign: "center", marginBottom: SPACINGS.MD }}>
            Here's your itinerary!
          </H1>
          <Tab
            value={index}
            onChange={(e) => {
              setIndex(e);
              setIndicatorX(e * tabWidth);
            }}
            disableIndicator={true}
            scrollable={true}
            indicatorStyle={{
              backgroundColor: "white",
              height: 0,
              transform: [{ translateX: indicatorX }], // for fixing translateX bug with tab component
            }}
          >
            <Tab.Item
              title="Overview"
              titleStyle={(active) =>
                active ? styles.activeTabTitle : styles.inactiveTabTitle
              }
              containerStyle={(active) =>
                active ? styles.activeTabContainer : styles.inactiveTabContainer
              }
            />
            <Tab.Item
              title="Accomm..."
              titleStyle={(active) =>
                active ? styles.activeTabTitle : styles.inactiveTabTitle
              }
              containerStyle={(active) =>
                active ? styles.activeTabContainer : styles.inactiveTabContainer
              }
            />
            <Tab.Item
              title="Day 1"
              titleStyle={(active) =>
                active ? styles.activeTabTitle : styles.inactiveTabTitle
              }
              containerStyle={(active) =>
                active ? styles.activeTabContainer : styles.inactiveTabContainer
              }
            />
          </Tab>
          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={styles.tabView}>
              <ScrollView>
                <H3 style={styles.tabViewHeading}>Overview</H3>
                <BodyText>
                  This is placeholder text for what will ultimately be an AI
                  generated summary of the overall itinerary, covering the
                  accommodation as well as giving a glimpse into some of the
                  activities that are planned for each day.
                </BodyText>
              </ScrollView>
            </TabView.Item>
            <TabView.Item style={styles.tabView}>
              <ScrollView>
                <H3 style={styles.tabViewHeading}>Accommodation</H3>
                {accommodation && (
                  <View>
                    <BodyText style={{ marginBottom: SPACINGS.SM }}>
                      We think the "{accommodation.title}" might be a top
                      choice, based on your preferences.
                    </BodyText>
                    <BodyText>
                      Tap on their listing below to find out more!
                    </BodyText>
                    <View style={{ alignItems: "center" }}>
                      <ExploreItemCarousel
                        items={[accommodation]}
                        navigation={navigation}
                        collectionName={CATEGORIES[0].dbName}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>
            </TabView.Item>
            <TabView.Item style={styles.tabView}>
              <ScrollView>
                <H3 style={styles.tabViewHeading}>Day 1</H3>
                <BodyText style={{ marginBottom: SPACINGS.SM }}>
                  This day's itinerary is tailored to your interests in xx and
                  xx
                </BodyText>
                <BodyText>
                  Here are some suggested activities for the day:
                </BodyText>
                <View style={{ alignItems: "center" }}>
                  <ExploreItemCarousel
                    items={experiences ?? []}
                    navigation={navigation}
                    collectionName={CATEGORIES[1].dbName}
                  />
                </View>
              </ScrollView>
            </TabView.Item>
          </TabView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.LIGHTACCENT,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  container: {
    flex: 1,
    margin: SPACINGS.MD,
  },
  stepsContainer: {
    margin: SPACINGS.MD,
  },
  simpleStep: {
    marginVertical: SPACINGS.XL,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACINGS.MD,
    borderRadius: SPACINGS.XL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: COLORS.WHITE,
    marginRight: SPACINGS.SM,
  },
  activeTabTitle: {
    color: COLORS.WHITE,
    paddingVertical: SPACINGS.XS,
    paddingHorizontal: SPACINGS.XXS,
    fontFamily: "Bitter-Bold",
  },
  inactiveTabTitle: {
    color: COLORS.PRIMARY,
    paddingVertical: SPACINGS.XS,
    paddingHorizontal: SPACINGS.XXS,
    fontFamily: "Bitter-Medium",
  },
  activeTabContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginHorizontal: SPACINGS.SM,
    borderRadius: SPACINGS.XL,
    alignContent: "center",
    justifyContent: "center",
  },
  inactiveTabContainer: {
    backgroundColor: COLORS.LIGHTBG,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginHorizontal: SPACINGS.SM,
    borderRadius: SPACINGS.XL,
    alignContent: "center",
    justifyContent: "center",
  },
  tabView: {
    backgroundColor: COLORS.LIGHTBG,
    borderRadius: SPACINGS.XL,
    flex: 1,
    width: "100%",
    margin: SPACINGS.MD,
    padding: SPACINGS.MD,
  },
  tabViewHeading: {
    marginBottom: SPACINGS.SM,
  },
});

export default ItineraryResults;
