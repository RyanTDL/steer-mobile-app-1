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
import { TripInputsContext } from "./components/TripInputsContext";
import { LinearProgress, ButtonGroup } from "@rneui/themed";
import DateSelector from "../bookings/components/DateSelector";
import FONTSIZES from "../../config/FONTSIZES";
import NumberToggle from "../post/components/NumberToggle";
import BodyText from "../../custom_components/typography/BodyText";

interface TripDateSelectionProps {
  navigation: NativeStackNavigationProp<any>;
}

function TripDateSelection({ navigation }: TripDateSelectionProps) {
  const [numNights, setNumNights] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [budget, setBudget] = useState<number>(1000);
  const [numPax, setNumPax] = useState(1);
  const { setTripLength, setTripBudget } = React.useContext(TripInputsContext);

  const handleBudgetPress = (option: string) => {
    switch (option) {
      case "0":
        setBudget(50);
        break;
      case "1":
        setBudget(100);
        break;
      case "2":
        setBudget(500);
        break;
      default:
        break;
    }
  };

  const handleNextPress = () => {
    if (startDate && endDate && startDate < endDate) {
      setTripLength(numNights);
      setTripBudget(budget);
      navigation.navigate("TripPeopleSelection", {
        navigation: navigation,
      });
    } else {
      alert("Please select a valid date range.");
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <LinearProgress
        color={COLORS.PRIMARY}
        value={0.25}
        variant="determinate"
      />
      <View style={styles.container}>
        <H1 style={{ marginBottom: SPACINGS.XL }}>Trip details:</H1>
        <View
          style={[styles.stepsContainer, { paddingVertical: SPACINGS.XXL }]}
        >
          <H3>Dates:</H3>
          <View>
            <DateSelector
              setNumNights={setNumNights}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          </View>
        </View>
        <View style={styles.stepsContainer}>
          <H3>Budget:</H3>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            <ButtonGroup
              buttons={["$", "$$", "$$$"]}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
                handleBudgetPress(value);
              }}
              containerStyle={styles.buttonGroup}
              selectedButtonStyle={{
                backgroundColor: COLORS.PRIMARY,
              }}
              textStyle={{
                fontSize: FONTSIZES.MD,
                fontFamily: "Bitter-Medium",
              }}
            />
          </View>
        </View>
        <View
          style={[styles.stepsContainer, { paddingVertical: SPACINGS.XXL }]}
        >
          <H3>Pax:</H3>
          <NumberToggle numItems={numPax} setNumItems={setNumPax} min={1} />
        </View>
        <BackNextButtonRow
          nextDisabled={startDate == null || endDate == null}
          navigation={navigation}
          nextPage="TripPeopleSelection"
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
    justifyContent: "center",
    margin: SPACINGS.MD,
  },
  stepsContainer: {
    backgroundColor: COLORS.LIGHTBG,
    borderRadius: SPACINGS.XL,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACINGS.MD,
    margin: SPACINGS.SM,
    width: "100%",
  },
  buttonGroup: {
    height: 40,
    width: "60%",
    paddingVertical: 0,
    borderWidth: 0,
    borderRadius: SPACINGS.MD,
  },
  hintText: {
    textAlign: "right",
  },
  simpleStep: {
    marginVertical: SPACINGS.XL,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default TripDateSelection;
