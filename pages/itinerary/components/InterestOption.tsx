import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import SimpleStep from "./SimpleStep";
import COLORS from "../../../config/COLORS";
import SPACINGS from "../../../config/SPACINGS";

interface InterestOptionProps {
  style?: ViewStyle;
  isPressed?: boolean;
  noIcon?: boolean;
  iconType?: string;
  iconName: string;
  heading: string;
  onPress: () => void;
}
const InterestOption = ({
  style,
  isPressed,
  noIcon,
  iconType,
  iconName,
  heading,
  onPress,
}: InterestOptionProps) => {
  return (
    <Pressable
      style={[
        styles.mainContainer,
        isPressed
          ? { borderColor: COLORS.PRIMARY }
          : { borderColor: COLORS.LIGHTACCENT },
        style,
      ]}
      onPress={() => onPress()}
    >
      <SimpleStep
        style={styles.stepContainer}
        useH3={true}
        noIcon={noIcon}
        iconContainerStyle={{ paddingRight: 0 }}
        iconType={iconType}
        iconName={iconName}
        heading={heading}
      />
    </Pressable>
  );
};

export default InterestOption;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    width: "45%",
    padding: SPACINGS.MD,
    borderWidth: 4,
    borderRadius: SPACINGS.XL,
    marginVertical: SPACINGS.SM,
  },
  stepContainer: {
    width: "100%",
  },
});
