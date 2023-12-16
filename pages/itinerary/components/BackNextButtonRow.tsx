import React from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { Icon } from "@rneui/themed";
import H3 from "../../../custom_components/typography/H3";
import COLORS from "../../../config/COLORS";
import SPACINGS from "../../../config/SPACINGS";
import ICONSIZES from "../../../config/ICONSIZES";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface BackNextButtonRowProps {
  style?: ViewStyle;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  navigation: NativeStackNavigationProp<any>;
  nextPage: string;
  onNextPress?: () => void;
}
const BackNextButtonRow = ({
  style,
  backDisabled,
  nextDisabled,
  navigation,
  nextPage,
  onNextPress,
}: BackNextButtonRowProps) => {
  return (
    <View style={[styles.container, style]}>
      <Pressable
        disabled={backDisabled}
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Icon
          color={COLORS.WHITE}
          type="material-community"
          name="arrow-left"
          size={ICONSIZES.XS}
        />
        <H3 style={styles.leftButtonText}>Back</H3>
      </Pressable>
      {!nextDisabled && (
        <Pressable
          disabled={nextDisabled}
          style={styles.button}
          onPress={
            onNextPress ? onNextPress : () => navigation.navigate(nextPage)
          }
        >
          <H3 style={styles.rightButtonText}>Next</H3>
          <Icon
            color={COLORS.WHITE}
            type="material-community"
            name="arrow-right"
            size={ICONSIZES.XS}
          />
        </Pressable>
      )}
    </View>
  );
};

export default BackNextButtonRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: SPACINGS.MD,
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACINGS.SM,
    paddingHorizontal: SPACINGS.LG,
    borderRadius: SPACINGS.XL,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
  },
  leftButtonText: {
    color: COLORS.WHITE,
    marginLeft: SPACINGS.XS,
  },
  rightButtonText: {
    color: COLORS.WHITE,
    marginRight: SPACINGS.XS,
  },
});
