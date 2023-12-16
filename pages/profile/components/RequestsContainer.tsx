import React from "react";
import { DocumentData } from "firebase/firestore";
import H3 from "../../../custom_components/typography/H3";
import SPACINGS from "../../../config/SPACINGS";
import { View } from "react-native";
import AccommodationRequests from "./AccommodationRequests";
import FONTSIZES from "../../../config/FONTSIZES";
import ExperienceRequests from "./ExperienceRequests";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BodyText from "../../../custom_components/typography/BodyText";

interface RequestsContainerProps {
  userOwnedAccommodations: DocumentData[];
  userOwnedExperiences: DocumentData[];
  navigation: NativeStackNavigationProp<any>;
}

const RequestsContainer = ({
  userOwnedAccommodations,
  userOwnedExperiences,
  navigation,
}: RequestsContainerProps) => {
  return (
    <View style={{ alignItems: "flex-start", paddingBottom: 230 }}>
      <H3 style={{ fontSize: FONTSIZES.MD }}>Accommodation Requests</H3>
      {userOwnedAccommodations.length == 0 && (
        <View
          style={{
            marginTop: SPACINGS.XS,
            marginLeft: SPACINGS.SM,
            marginBottom: SPACINGS.MD,
          }}
        >
          <BodyText>More details coming soon!</BodyText>
          <BodyText>
            Check your chats to see if the operator has approved your booking
            request.
          </BodyText>
        </View>
      )}
      {userOwnedAccommodations.map((accommodation, index) => (
        <AccommodationRequests
          key={index}
          accommodation={accommodation}
          navigation={navigation}
        />
      ))}
      <H3 style={{ marginTop: SPACINGS.MD, fontSize: FONTSIZES.MD }}>
        Experience Requests
      </H3>
      {userOwnedExperiences.length == 0 && (
        <View
          style={{
            marginTop: SPACINGS.XS,
            marginLeft: SPACINGS.SM,
          }}
        >
          <BodyText>More details coming soon!</BodyText>
          <BodyText>
            Check your chats to see if the operator has approved your booking
            request.
          </BodyText>
        </View>
      )}
      {userOwnedExperiences.map((experience, index) => (
        <ExperienceRequests
          key={index}
          experience={experience}
          navigation={navigation}
        />
      ))}
    </View>
  );
};

export default RequestsContainer;
