import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Pressable,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import COLORS from "../../config/COLORS";
import SPACINGS from "../../config/SPACINGS";
import H1 from "../../custom_components/typography/H1";
import { Icon } from "@rneui/themed";
import ICONSIZES from "../../config/ICONSIZES";
import SimpleStep from "./components/SimpleStep";
import H3 from "../../custom_components/typography/H3";

interface ItineraryLandingProps {
  navigation: NativeStackNavigationProp<any>;
}

function ItineraryLanding({ navigation }: ItineraryLandingProps) {
  // useEffect(() => {
  //   const callHelloWorldFunction = async () => {
  //     console.log("Calling hello world function");
  //     const response = await fetch(
  //       "http://127.0.0.1:5001/steer-app-168c6/helloWorld"
  //     );
  //     const data = await response.text();
  //     console.log(data); // Should log: "Hello from Firebase!"
  //   };

  //   callHelloWorldFunction();
  // }, []);
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <H1 style={{ textAlign: "center" }}>
          Build your perfect itinerary in just 3 simple steps!
        </H1>
        <View style={styles.stepsContainer}>
          <SimpleStep
            iconName="clipboard-plus-outline"
            heading="Add trip details"
            text="When's the trip? Who's coming? Fill us in."
            style={styles.simpleStep}
          />
          <SimpleStep
            iconName="clipboard-text-outline"
            heading="Choose  preferences"
            text="Select your interests and holiday style."
            style={styles.simpleStep}
          />
          <SimpleStep
            iconName="clipboard-edit-outline"
            heading="Edit the plan!"
            text="Add or remove activities to create the perfect itinerary."
            style={styles.simpleStep}
          />
        </View>
        <View>
          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate("TripDateSelection", {
                navigation: navigation,
              })
            }
          >
            <H3 style={styles.buttonText}>Get Started</H3>
            <Icon
              color={COLORS.WHITE}
              type="material-community"
              name="arrow-right"
              size={ICONSIZES.MD}
            />
          </Pressable>
        </View>
      </View>
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
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: SPACINGS.MD,
  },
  stepsContainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
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
});

export default ItineraryLanding;
