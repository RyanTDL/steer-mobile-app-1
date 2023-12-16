import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../../firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ICONSIZES from "../../../config/ICONSIZES";
import COLORS from "../../../config/COLORS";
import FONTSIZES from "../../../config/FONTSIZES";
import SPACINGS from "../../../config/SPACINGS";

interface UploadInfoProps {
  name: string;
  isUserModalVisible: boolean;
  setUserModalVisible(isVisible: boolean): any;
  navigation: NativeStackNavigationProp<any>;
}

function UploadInfo({
  name,
  isUserModalVisible,
  setUserModalVisible,
  navigation,
}: UploadInfoProps) {
  const handleSignOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error: { message: any }) => alert(error.message));
  };

  return (
    <View style={{ marginLeft: 15 }}>
      <View style={styles.button}>
        <Text style={styles.profileText} numberOfLines={2}>
          {name}
        </Text>
        <TouchableOpacity
          onPress={() => setUserModalVisible(!isUserModalVisible)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={ICONSIZES.XXS}
            color={COLORS.DARKBG}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default UploadInfo;

const styles = StyleSheet.create({
  profileText: {
    fontFamily: "Bitter-Medium",
    fontSize: FONTSIZES.MD,
    color: COLORS.DARKBG,
    maxWidth: "80%",
    marginHorizontal: SPACINGS.XS,
  },

  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: SPACINGS.LG,
    marginVertical: SPACINGS.SM,
    width: 200,
    paddingVertical: SPACINGS.SM,
    paddingHorizontal: SPACINGS.SM,
    backgroundColor: COLORS.LIGHTBG,
  },

  signOutButton: {
    backgroundColor: COLORS.PRIMARY,
    width: "60%",
    padding: SPACINGS.XS,
    paddingVertical: SPACINGS.SM,
    borderRadius: SPACINGS.XL,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.WHITE,
    fontFamily: "Bitter-Bold",
    fontSize: FONTSIZES.MD,
  },
});
