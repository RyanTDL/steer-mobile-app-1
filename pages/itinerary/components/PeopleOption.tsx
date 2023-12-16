import React from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { Icon } from "@rneui/themed";
import SimpleStep from "./SimpleStep";
import COLORS from "../../../config/COLORS";
import ICONSIZES from "../../../config/ICONSIZES";
import SPACINGS from "../../../config/SPACINGS";

interface PeopleOptionProps {
  style?: ViewStyle;
  isPressed?: boolean;
  iconName: string;
  heading: string;
  text: string;
  onPress: () => void;
}
const PeopleOption = ({
  style,
  isPressed,
  iconName,
  heading,
  text,
  onPress,
}: PeopleOptionProps) => {
  return (
    <Pressable
      style={[
        styles.mainContainer,
        { borderColor: isPressed ? COLORS.PRIMARY : COLORS.LIGHTBG },
        style,
      ]}
      onPress={() => onPress()}
    >
      <View style={styles.indicatorContainer}>
        <Icon
          color={COLORS.PRIMARY}
          type="material-community"
          name={isPressed ? "radiobox-marked" : "radiobox-blank"}
          size={ICONSIZES.XXS}
        />
      </View>
      <SimpleStep
        style={styles.stepContainer}
        iconName={iconName}
        heading={heading}
        text={text}
      />
    </Pressable>
  );
};

export default PeopleOption;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    width: "100%",
    padding: SPACINGS.MD,
    borderWidth: 4,
    borderRadius: SPACINGS.XL,
    marginVertical: SPACINGS.SM,
  },
  indicatorContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  stepContainer: {
    width: "90%",
    marginLeft: SPACINGS.MD,
  },
});
