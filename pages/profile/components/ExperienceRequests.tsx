import React, { useEffect, useState } from "react";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import H3 from "../../../custom_components/typography/H3";
import SPACINGS from "../../../config/SPACINGS";
import { View } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import FONTSIZES from "../../../config/FONTSIZES";
import ExpReqCard from "./ExpReqCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface ExperienceRequestsProps {
  experience: DocumentData;
  navigation: NativeStackNavigationProp<any>;
}

const ExperienceRequests = ({
  experience,
  navigation,
}: ExperienceRequestsProps) => {
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [experienceRequests, setExperienceRequests] = useState<DocumentData[]>(
    []
  );
  const [loadingExperienceRequests, setLoadingExperienceRequests] =
    useState<boolean>(true);

  const getExperienceRequests = async () => {
    const newExperienceRequests: DocumentData[] = [];
    const experienceRequestsQuerySnapshot = await getDocs(
      collection(firestore, "experiences", experience.firestoreID, "bookings")
    );
    experienceRequestsQuerySnapshot.forEach((doc) =>
      newExperienceRequests.push(doc.data())
    );
    setExperienceRequests(newExperienceRequests);
    setLoadingExperienceRequests(false);
  };
  useEffect(() => {
    if (experienceRequests.length == 0) {
      getExperienceRequests();
    }
  }, []);

  return (
    <View style={{ width: "100%" }}>
      {experienceRequests.length == 0 && (
        <H3
          style={{
            marginTop: SPACINGS.SM,
            fontSize: FONTSIZES.SM,
          }}
        >
          - No new requests for {experience.title}
        </H3>
      )}
      {experienceRequests.length != 0 && !loadingExperienceRequests && (
        <>
          <H3
            style={{
              marginTop: SPACINGS.SM,
              fontSize: FONTSIZES.SM,
            }}
          >
            {experience.title}
          </H3>
          {experienceRequests.map((experienceRequest, index) => (
            <ExpReqCard
              key={index}
              expReq={experienceRequest}
              navigation={navigation}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default ExperienceRequests;
