import React, { useEffect } from "react";
import { Avatar } from "@rneui/themed";
import { View, StyleSheet, Pressable } from "react-native";
import BodyText from "../../../custom_components/typography/BodyText";
import COLORS from "../../../config/COLORS";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { DocumentData } from "@google-cloud/firestore";
import SPACINGS from "../../../config/SPACINGS";
import ChatButton from "../../chat/components/ChatButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { defaultProfilePicURL } from "../../../config/CONSTANTS";

interface ExpReqCardProps {
  expReq: DocumentData;
  navigation: NativeStackNavigationProp<any>;
}

const ExpReqCard: React.FC<ExpReqCardProps> = ({ expReq, navigation }) => {
  const requesterId: string = expReq.guestId;
  const selectedDate: Timestamp = expReq.selectedDate;
  const requestTime: Timestamp = expReq.requestTime;
  const numGuests: number = expReq.numGuests;
  const totalPrice: number = expReq.totalPrice;
  const [isApproved, setIsApproved] = React.useState<boolean>(
    expReq.isApproved
  );
  const [requesterName, setRequesterName] = React.useState<string>("");
  const [avatarUri, setAvatarUri] =
    React.useState<string>(defaultProfilePicURL);

  const getUserInfo = async () => {
    const docRef = doc(firestore, "users", requesterId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        setRequesterName(data.displayName);
        setAvatarUri(data.profilePic);
      }
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.avatarContainer}>
        <Avatar source={{ uri: avatarUri }} rounded size={44} />
        <View style={{ paddingVertical: SPACINGS.LG }}>
          <ChatButton navigation={navigation} recipientID={requesterId} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <BodyText>{"Customer: " + requesterName}</BodyText>
        <BodyText>
          {"Selected Date: " + selectedDate.toDate().toLocaleDateString()}
        </BodyText>
        <BodyText>{"No. of pax: " + numGuests}</BodyText>
        <BodyText style={{ fontFamily: "Bitter-Bold" }}>
          {"Total: $" + totalPrice}
        </BodyText>
        <BodyText
          style={{
            marginTop: SPACINGS.XS,
            marginBottom: SPACINGS.SM,
            textDecorationLine: "underline",
          }}
        >
          {"Requested on: " + requestTime.toDate().toLocaleDateString()}
        </BodyText>
        <View
          style={{
            width: "80%",
            marginTop: SPACINGS.SM,
          }}
        >
          <Pressable
            onPress={() => {
              setIsApproved(true);
            }}
            style={[styles.acceptButton, { opacity: isApproved ? 0.5 : 1 }]}
          >
            <BodyText style={styles.buttonText}>Approve</BodyText>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsApproved(false);
            }}
            style={styles.rejectButton}
          >
            <BodyText style={styles.buttonText}>Reject</BodyText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ExpReqCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.LIGHTACCENT,
    paddingHorizontal: SPACINGS.MD,
    paddingVertical: SPACINGS.MD,
    marginVertical: SPACINGS.XS,
    borderRadius: SPACINGS.LG,
    flexDirection: "row",
  },
  avatarContainer: {},
  textContainer: {
    borderLeftWidth: 1,
    paddingLeft: SPACINGS.MD,
    borderLeftColor: "#00000022",
    marginLeft: SPACINGS.SM,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontFamily: "Bitter-Bold",
  },
  acceptButton: {
    borderRadius: SPACINGS.LG,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACINGS.SM,
    marginBottom: SPACINGS.SM,
  },
  rejectButton: {
    borderRadius: SPACINGS.LG,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACINGS.SM,
  },
});
