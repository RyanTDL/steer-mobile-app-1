import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import COLORS from "../../config/COLORS";
import SPACINGS from "../../config/SPACINGS";
import H1 from "../../custom_components/typography/H1";
import H3 from "../../custom_components/typography/H3";
import BackNextButtonRow from "./components/BackNextButtonRow";
import InterestOption from "./components/InterestOption";
import { LinearProgress } from "@rneui/themed";
import { TripInputsContext } from "./components/TripInputsContext";
import BodyText from "../../custom_components/typography/BodyText";

interface TripInterestSelectionProps {
  navigation: NativeStackNavigationProp<any>;
}

function TripInterestSelection({ navigation }: TripInterestSelectionProps) {
  const [outdoors, setOutdoors] = useState<boolean>(false);
  const [wildlife, setWildlife] = useState<boolean>(false);
  const [plants, setPlants] = useState<boolean>(false);
  const [farms, setFarms] = useState<boolean>(false);
  const [food, setFood] = useState<boolean>(false);
  const [hiking, setHiking] = useState<boolean>(false);
  const [relax, setRelax] = useState<boolean>(false);
  const [culture, setCulture] = useState<boolean>(false);
  const { setTripInterests } = React.useContext(TripInputsContext);

  const handleNextPress = () => {
    const interests = [];
    if (outdoors) interests.push("outdoor");
    if (wildlife) interests.push("wildlife");
    if (plants) interests.push("plants");
    if (farms) interests.push("farms");
    if (food) interests.push("food");
    if (hiking) interests.push("hiking");
    if (relax) interests.push("relax");
    if (culture) interests.push("culture");
    setTripInterests(interests);
    navigation.navigate("TripPreferences");
  };

  return (
    <SafeAreaView style={styles.background}>
      <LinearProgress
        color={COLORS.PRIMARY}
        value={0.75}
        variant="determinate"
      />
      <View style={styles.container}>
        <H1>Pick your interests:</H1>
        <View style={styles.optionsContainer}>
          <InterestOption
            isPressed={outdoors}
            iconType="material"
            iconName="backpack"
            heading="Outdoor"
            onPress={() => setOutdoors(!outdoors)}
          />
          <InterestOption
            isPressed={wildlife}
            iconName="paw"
            heading="Wildlife"
            onPress={() => setWildlife(!wildlife)}
          />
          <InterestOption
            isPressed={plants}
            iconName="flower"
            heading="Plants"
            onPress={() => setPlants(!plants)}
          />
          <InterestOption
            isPressed={farms}
            iconName="tractor"
            heading="Farms"
            onPress={() => setFarms(!farms)}
          />
          <InterestOption
            isPressed={food}
            iconName="food-fork-drink"
            heading="Food"
            onPress={() => setFood(!food)}
          />
          <InterestOption
            isPressed={hiking}
            iconName="hiking"
            heading="Hiking"
            onPress={() => setHiking(!hiking)}
          />
          <InterestOption
            isPressed={relax}
            iconName="umbrella-beach"
            heading="Relax"
            onPress={() => setRelax(!relax)}
          />
          <InterestOption
            isPressed={culture}
            iconName="handshake"
            heading="Culture"
            onPress={() => setCulture(!culture)}
          />
        </View>
        <BackNextButtonRow
          nextDisabled={
            !(
              outdoors ||
              wildlife ||
              plants ||
              farms ||
              food ||
              hiking ||
              relax ||
              culture
            )
          } // Disable when no option is selected
          navigation={navigation}
          nextPage="TripPreferences"
          onNextPress={handleNextPress}
        />
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
  optionsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: SPACINGS.MD,
  },
  button: {},
});

export default TripInterestSelection;
