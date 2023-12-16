import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "@rneui/themed";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData,
} from "firebase/firestore";
import { firestore, firebaseAuth } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import ICONSIZES from "../../../config/ICONSIZES";
import COLORS from "../../../config/COLORS";
import SPACINGS from "../../../config/SPACINGS";

interface HeartButtonProps {
  listingCollection: string;
  item: DocumentData;
  defaultState?: boolean;
}

function HeartButton({
  listingCollection,
  item,
  defaultState,
}: HeartButtonProps) {
  const [isLiked, setIsLiked] = React.useState(defaultState ?? false);
  const [user, loading, error] = useAuthState(firebaseAuth);

  async function setSavedPost() {
    try {
      const savedRef = doc(firestore, "users", user?.uid as any);
      if (listingCollection === "accommodations") {
        await updateDoc(savedRef, {
          favouritedAccommodations: arrayUnion(item.firestoreID),
        });
      } else if (listingCollection === "experiences") {
        await updateDoc(savedRef, {
          favouritedExperiences: arrayUnion(item.firestoreID),
        });
      }
    } catch (error) {
      console.error("Error favouriting post", error);
    }
  }

  async function removeSavedPost() {
    try {
      const savedRef = doc(firestore, "users", user?.uid as any);
      if (listingCollection === "accommodations") {
        await updateDoc(savedRef, {
          favouritedAccommodations: arrayRemove(item.firestoreID),
        });
      } else if (listingCollection === "experiences") {
        await updateDoc(savedRef, {
          favouritedExperiences: arrayRemove(item.firestoreID),
        });
      }
    } catch (error) {
      console.error("Error unfavouriting post", error);
    }
  }

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (isLiked) {
            removeSavedPost();
          } else {
            setSavedPost();
          }
          setIsLiked(!isLiked);
        }}
        style={styles.heartButton}
      >
        {isLiked ? (
          <Icon
            color={COLORS.PRIMARY}
            type="material-community"
            name="heart"
            size={ICONSIZES.XL}
          />
        ) : (
          <Icon
            color={COLORS.WHITE}
            type="material-community"
            name="heart"
            size={ICONSIZES.XL}
            style={{ opacity: 0.6 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default HeartButton;

const styles = StyleSheet.create({
  heartButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: SPACINGS.MD,
  },
});
