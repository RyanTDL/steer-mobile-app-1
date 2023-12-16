import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DocumentData } from "firebase/firestore";
import H3 from "../../../custom_components/typography/H3";
import BodyText from "../../../custom_components/typography/BodyText";
import ExploreItemCarousel from "../../explore/components/ExploreItemCarousel";
import SPACINGS from "../../../config/SPACINGS";
import { View } from "react-native";

interface ProfileCarouselProps {
  navigation: NativeStackNavigationProp<any>;
  title: string;
  noDataMessage: string;
  carouselData: DocumentData[];
  carouselCollectionName: string;
  isFavourite?: boolean;
}

const ProfileCarousel = ({
  navigation,
  title,
  noDataMessage,
  carouselData,
  carouselCollectionName,
  isFavourite,
}: ProfileCarouselProps) => {
  return (
    <View style={{ alignItems: "center", paddingBottom: 80 }}>
      <H3
        style={{
          marginTop: SPACINGS.MD,
          marginBottom: -SPACINGS.LG,
          alignSelf: "center",
        }}
      >
        {title}
      </H3>
      {carouselData.length == 0 && (
        <BodyText
          style={{
            marginTop: SPACINGS.XL,
            marginBottom: SPACINGS.LG,
            alignSelf: "center",
          }}
        >
          {noDataMessage}
        </BodyText>
      )}
      {carouselData.length > 0 && (
        <ExploreItemCarousel
          navigation={navigation}
          items={carouselData}
          collectionName={carouselCollectionName}
          isFavourite={isFavourite}
        />
      )}
    </View>
  );
};

export default ProfileCarousel;
