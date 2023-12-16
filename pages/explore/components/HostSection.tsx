import { StyleSheet, View } from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import React from "react";
import ICONSIZES from "../../../config/ICONSIZES";
import COLORS from "../../../config/COLORS";
import SPACINGS from "../../../config/SPACINGS";
import H3 from "../../../custom_components/typography/H3";
import FONTSIZES from "../../../config/FONTSIZES";
import H2 from "../../../custom_components/typography/H2";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { defaultProfilePicURL } from "../../../config/CONSTANTS";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ChatButton from "../../chat/components/ChatButton";

interface HostSectionProps {
  navigation: NativeStackNavigationProp<any>;
  hostID: string;
}

const HostSection: React.FC<HostSectionProps> = ({ navigation, hostID }) => {
  //Used for user info retrieval
  const [user, loading, error] = useAuthState(firebaseAuth);
  //Used to set user info
  const [username, setUsername] = React.useState("-");
  const [profilePic, setProfilePic] = React.useState(defaultProfilePicURL);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  //Retrieves profile info when page first rendered
  const getProfile = async () => {
    try {
      const profileRef = doc(firestore, "users", hostID);
      const userProfile = await getDoc(profileRef);
      setUsername(userProfile.data()?.displayName);
      setProfilePic(userProfile.data()?.profilePic);
      //TODO: Add star rating and sustainability rating
    } catch (error) {
      console.error("Error retrieving profile data:", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isLoading) {
      getProfile();
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <H2>Host</H2>
        <ChatButton navigation={navigation} recipientID={hostID} />
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.avatarContainer}>
          <Avatar rounded source={{ uri: profilePic }} size={64} />
        </View>
        <View style={styles.textContainer}>
          <H3 style={{ fontSize: FONTSIZES.XL }}>{username}</H3>
          <View style={styles.ratingContainer}>
            <H3>-</H3>
            <Icon
              color={COLORS.PRIMARY}
              type="material-community"
              name="star"
              size={ICONSIZES.MD}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HostSection;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    justifyContent: "center",
    padding: SPACINGS.MD,
  },
  headerContainer: {
    width: "100%",
    marginBottom: SPACINGS.SM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: COLORS.LIGHTACCENT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: SPACINGS.SM,
    borderRadius: SPACINGS.LG,
  },
  avatarContainer: {
    width: "30%",
    justifyContent: "center",
    padding: SPACINGS.MD,
  },
  textContainer: {
    width: "70%",
    justifyContent: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: SPACINGS.XS,
  },
});
