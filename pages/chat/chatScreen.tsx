import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatContext } from "./ChatContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { firestore } from "../../firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Message from "./components/Message";
import Input from "./components/Input";
import COLORS from "../../config/COLORS";
import { Ionicons } from "@expo/vector-icons";
import SPACINGS from "../../config/SPACINGS";
import H1 from "../../custom_components/typography/H1";
import ICONSIZES from "../../config/ICONSIZES";

type RootStackParamList = {
  ChatList: undefined;
  ChatScreen: { chatId: string } | undefined;
};

type messagesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChatScreen"
>;

type MessagesProps = {
  navigation: messagesNavigationProp;
};

const { width, height } = Dimensions.get("screen");

const ChatScreen = ({ navigation }: MessagesProps) => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [recipientDisplayName, setRecipientDisplayName] = useState<string>("");

  const recipientId = data.userInfo.uid;
  useEffect(() => {
    const fetchRecipientDisplayName = async () => {
      try {
        const userDocRef = doc(firestore, "users", recipientId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setRecipientDisplayName(userData.displayName);
        }
      } catch (error) {
        console.error("Error fetching recipient's display name:", error);
      }
    };

    fetchRecipientDisplayName();
  }, [recipientId]);

  //console.log("data: ", data);

  useEffect(() => {
    const documentRef = doc(collection(firestore, "chats"), data.chatId);

    const unsubscribe: Unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
      const data = docSnapshot.exists() ? docSnapshot.data() : null;
      const messagesArray = data ? data.messages : [];
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [data.chatId]);

  // console.log(messages);
  // console.log(recipientDisplayName);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.usernameContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={styles.backArrow} name="arrow-back" />
        </TouchableOpacity>
        <H1 style={styles.username}>{recipientDisplayName}</H1>
      </View>
      <ScrollView>
        {messages.length > 0 &&
          messages.map((m: any) => <Message message={m} key={m.id} />)}
      </ScrollView>
      <Input />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.LIGHTBG,
    paddingHorizontal: SPACINGS.LG,
    paddingTop: 0,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center", // Center the text horizontally
    // justifyContent: "center", // Add this to place the arrow on the left
    marginBottom: SPACINGS.XL,
  },
  username: {
    flex: 1,
    textAlign: "center", // Center the text horizontally within its space
  },
  backArrow: {
    fontSize: ICONSIZES.SM,
    color: COLORS.DARKBG,
    // position: 'absolute',
  },
});

export default ChatScreen;
