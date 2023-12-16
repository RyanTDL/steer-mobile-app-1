import React, { useContext } from "react";
import { Pressable, StyleSheet } from "react-native";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import { ChatContext } from "../ChatContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@rneui/themed";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import SPACINGS from "../../../config/SPACINGS";
import COLORS from "../../../config/COLORS";
import ICONSIZES from "../../../config/ICONSIZES";
import FONTSIZES from "../../../config/FONTSIZES";

type RootStackParamList = {
  ChatButton: undefined;
  ChatScreen: { chatId: string } | undefined;
};

type launchChatPageNavigationProp = NativeStackNavigationProp<any>;
// Change 'any' back to 'RootStackParamList,"ChatButton"' if it causes any issues

type LaunchChatProps = {
  navigation: launchChatPageNavigationProp;
  recipientID: string;
};

const auth = firebaseAuth;

const ChatButton = ({ navigation, recipientID }: LaunchChatProps) => {
  const { dispatch } = useContext(ChatContext);
  const currentUser = {
    displayName: "John Doe",
    email: auth?.currentUser?.email,
    uid: auth?.currentUser?.uid,
  };

  const currentUserId = currentUser.uid || "";

  const handleSelectLaunchChat = async () => {
    const recipientInfo = {
      uid: recipientID,
    };

    const recipientId = recipientInfo.uid;

    const chatId =
      currentUserId < recipientId
        ? currentUserId + recipientId
        : recipientId + currentUserId;

    console.log(chatId);

    // Check if a document with the chatId exists in the "chats" collection
    const chatDocRef = doc(firestore, "chats", chatId);
    const chatDocSnap = await getDoc(chatDocRef);

    if (!chatDocSnap.exists()) {
      try {
        await setDoc(doc(firestore, "chats", chatId), {
          messages: {},
          userIdA: currentUserId,
          userIdB: recipientId,
        });

        // Update the user's "chats" array in the "userChats" collection
        const currentUserChatsDocRef = doc(
          firestore,
          "userChats",
          currentUserId
        );
        const currentUserChatsDoc = await getDoc(currentUserChatsDocRef);

        if (currentUserChatsDoc.exists()) {
          const currentUserChatsData = currentUserChatsDoc.data();

          const updatedChats = [
            ...currentUserChatsData.chats,
            {
              chatId: chatId,
              ["userInfo"]: {
                uid: recipientId,
              },
            },
          ];

          await updateDoc(currentUserChatsDocRef, {
            chats: updatedChats,
          });

          // const updatedChats = userChatsData.chats.concat(chatId);

          // await updateDoc(userChatsDocRef, {
          //   chats: updatedChats,
          // });

          console.log("Chat created and user updated.");
        } else {
          console.log("User document not found.");
        }

        const hostChatsDocRef = doc(firestore, "userChats", recipientId);
        const hostChatsDoc = await getDoc(hostChatsDocRef);

        if (hostChatsDoc.exists()) {
          const hostChatsData = hostChatsDoc.data();

          const updatedHostChats = [
            ...hostChatsData.chats,
            {
              chatId: chatId,
              ["userInfo"]: {
                uid: currentUserId,
              },
            },
          ];

          await updateDoc(hostChatsDocRef, {
            chats: updatedHostChats,
          });
        } else {
          console.log("Host document not found.");
        }

        // const userChatsDocRef = doc(firestore, "userChats", currentUserId);
        // const userChatsDoc = await getDoc(userChatsDocRef);

        // if (userChatsDoc.exists()) {
        //   const userChatsData = userChatsDoc.data();
        //   const updatedChats = userChatsData.chats.concat(chatId);

        //   await updateDoc(userChatsDocRef, {
        //     chats: updatedChats,
        //   });

        //   console.log("Chat created and user updated.");
        // } else {
        //   console.log("User document not found.");
        // }
      } catch (error) {
        console.error("Error while creating chat or updating user:", error);
      }
    }

    dispatch({
      type: "GET_CHAT_ID",
      payload: recipientInfo,
    });

    navigation.navigate("Chat", {
      screen: "ChatScreen",
      params: { chatId },
    });
  };

  return (
    <Pressable style={styles.button} onPress={handleSelectLaunchChat}>
      <Icon
        type="material-community"
        name="message-text-outline"
        color={COLORS.WHITE}
        size={ICONSIZES.XS}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: ICONSIZES.LG,
    width: ICONSIZES.LG,
    height: ICONSIZES.LG,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.WHITE,
    marginLeft: SPACINGS.SM,
    fontSize: FONTSIZES.MD,
  },
});

export default ChatButton;
