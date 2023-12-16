import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UploadPic from "./components/UploadPic";
import UploadInfo from "./components/UploadInfo";
import PopupModal from "../../custom_components/PopupModal";
import * as ImagePicker from "expo-image-picker";
import { firebaseAuth, firestore, firebaseStorage } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentData, doc, getDoc, updateDoc } from "firebase/firestore";
import "firebase/storage";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import SPACINGS from "../../config/SPACINGS";
import COLORS from "../../config/COLORS";
import FONTSIZES from "../../config/FONTSIZES";
import CATEGORIES from "../../config/CATEGORIES";
import H3 from "../../custom_components/typography/H3";
import { ButtonGroup, Tab, TabView } from "@rneui/themed";
import ProfileCarousel from "./components/ProfileCarousel";
import RequestsContainer from "./components/RequestsContainer";

type RootStackParamList = {
  Profile: undefined;
  Edit: undefined;
};

type profilePageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type Props = {
  navigation: profilePageScreenNavigationProp;
  userProfile: {};
};

interface ProfileData {
  displayName: string;
  email: string;
  profilePic: string;
  uid: string;
}

const width = Dimensions.get("window").width;

const ProfilePage = ({ navigation }: Props) => {
  // for managing tabs
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // Used to set user info
  const [username, setUsername] = React.useState("");
  const [usernameModal, setUsernameModal] = React.useState(false);
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [profileInfo, setProfileInfo] = React.useState<ProfileData | any>({});
  // Used to retrieve user's favourited listings
  const [userSavedAccommodations, setUserSavedAccommodations] = React.useState<
    DocumentData[]
  >([]);
  const [userSavedExperiences, setUserSavedExperiences] = React.useState<
    DocumentData[]
  >([]);
  const [isLoadingFavs, setIsLoadingFavs] = React.useState(true);
  // Used to retrieve user's personal listings
  const [userOwnedAccommodations, setUserOwnedAccommodations] = React.useState<
    DocumentData[]
  >([]);
  const [userOwnedExperiences, setUserOwnedExperiences] = React.useState<
    DocumentData[]
  >([]);
  const [isLoadingPersonal, setIsLoadingPersonal] = React.useState(true);

  // Retrieves profile info and favourited listings
  const getProfile = async () => {
    try {
      // get user profile info
      const profileRef = doc(firestore, "users", user?.uid as any);
      const userProfile = await getDoc(profileRef);
      const currUserDoc = userProfile.data();
      setProfileInfo(currUserDoc);

      // get accommodations favourited by user (if any)
      const userSavedAccommodationIDs =
        currUserDoc?.favouritedAccommodations ?? [];
      if (userSavedAccommodationIDs.length > 0) {
        const userSavedAccommodationDocs: DocumentData[] = [];
        for (let i = 0; i < userSavedAccommodationIDs.length; i++) {
          const postRef = doc(
            firestore,
            "accommodations",
            userSavedAccommodationIDs[i]
          );
          const postDoc = await getDoc(postRef);
          const postDocData = postDoc.data();
          if (postDocData) {
            userSavedAccommodationDocs.push(postDocData);
          }
        }
        setUserSavedAccommodations(userSavedAccommodationDocs);
      }

      // get experiences favourited by user (if any)
      const userSavedExperienceIDs = currUserDoc?.favouritedExperiences ?? [];
      if (userSavedExperienceIDs.length > 0) {
        const userSavedExperienceDocs: DocumentData[] = [];
        for (let i = 0; i < userSavedExperienceIDs.length; i++) {
          const postRef = doc(
            firestore,
            "experiences",
            userSavedExperienceIDs[i]
          );
          const postDoc = await getDoc(postRef);
          const postDocData = postDoc.data();
          if (postDocData) {
            userSavedExperienceDocs.push(postDocData);
          }
        }
        setUserSavedExperiences(userSavedExperienceDocs);
      }
    } catch (error) {
      console.error("Error retrieving profile data:", error);
    }
    setIsLoadingFavs(false);
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  // Retrieves personally owned listings
  const getPersonalPosts = async () => {
    try {
      // get accommodations owned by user (if any)
      const userOwnedAccommodationIDs = profileInfo?.ownedAccommodations ?? [];
      if (userOwnedAccommodationIDs.length > 0) {
        const userOwnedAccommodationDocs: DocumentData[] = [];
        for (let i = 0; i < userOwnedAccommodationIDs.length; i++) {
          const postRef = doc(
            firestore,
            "accommodations",
            userOwnedAccommodationIDs[i]
          );
          const postDoc = await getDoc(postRef);
          const postDocData = postDoc.data();
          if (postDocData) {
            userOwnedAccommodationDocs.push(postDocData);
          }
        }
        setUserOwnedAccommodations(userOwnedAccommodationDocs);
      }

      // get experiences owned by user (if any)
      const userOwnedExperienceIDs = profileInfo?.ownedExperiences ?? [];
      if (userOwnedExperienceIDs.length > 0) {
        const userOwnedExperienceDocs: DocumentData[] = [];
        for (let i = 0; i < userOwnedExperienceIDs.length; i++) {
          const postRef = doc(
            firestore,
            "experiences",
            userOwnedExperienceIDs[i]
          );
          const postDoc = await getDoc(postRef);
          const postDocData = postDoc.data();
          if (postDocData) {
            userOwnedExperienceDocs.push(postDocData);
          }
        }
        setUserOwnedExperiences(userOwnedExperienceDocs);
      }
    } catch (error) {
      console.error("Error retrieving personal posts:", error);
    }
    setIsLoadingPersonal(false);
  };

  // Code for profile picture upload
  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status != "granted") {
      alert(
        "Please enable camera roll permissions inside your system's settings"
      );
    } else {
      console.log("Media Permissions have been granted");
    }
  };

  // handles profile picture upload
  const addImage = async () => {
    checkForCameraRollPermission();
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //determines the type of file used: Image, video or both
      allowsEditing: true, //provides an editing interface to crop/edit image after it is selected from photo library
      aspect: [1, 1], //speciifies the fixed aspect ratio for your cropped image
      quality: 0.2, //controls quality of the selected image, value between 0 to 1, which 1 denoting highest quality
    });

    if (!_image.canceled) {
      //checks that the user doesn't close photo library before selecting an image
      // console.log(_image)
      saveProfilePic(_image.assets[0]);
    }
  };

  /**
   * Uploads image to firebase storage
   * Why are we using XMLHttpRequest? See:
   * https://github.com/expo/expo/issues/2402#issuecomment-443726662
   * @param saved_image
   */
  const saveProfilePic = async (saved_image: ImagePicker.ImagePickerAsset) => {
    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", saved_image.uri, true);
        xhr.send(null);
      });
      const imageRef = storageRef(
        firebaseStorage,
        `images/userProfileImages/${user!.uid}`
      );
      await uploadBytes(imageRef, blob);
      console.log("Image uploaded to firebase storage");

      //Update url link to firestore
      const url = await getDownloadURL(imageRef);
      const docRef = doc(firestore, "users", user!.uid);
      await updateDoc(docRef, {
        profilePic: url, //saves the uri of the image to the database
      });
      getProfile();
    } catch (error) {
      console.error("Error updating profile pic to users collection:", error);
    }
  };

  //handles username update
  const saveUsername = async () => {
    try {
      const docRef = doc(firestore, "users", user!.uid);
      await updateDoc(docRef, {
        displayName: username,
      });
      getProfile();
    } catch (error) {
      console.error("Error updating username to users collection:", error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Profile Info */}
      <View style={styles.profile}>
        <UploadPic
          url={profileInfo ? profileInfo["profilePic"] : ""} //sets placeholder in case user data does not exist
          addImage={addImage}
        />
        <UploadInfo
          name={profileInfo ? profileInfo["displayName"] : "Placeholder name"}
          isUserModalVisible={usernameModal}
          setUserModalVisible={setUsernameModal}
          navigation={navigation}
        />
      </View>

      {/* Modals */}
      <PopupModal
        inputHeading="Enter your new username below:"
        inputValue={username}
        setInputValue={setUsername}
        saveValue={saveUsername}
        isModalVisible={usernameModal}
        setModalVisibility={setUsernameModal}
      />

      {/* Posts */}
      {/* marginBottom to leave space for the NavBar */}
      <View style={styles.posts}>
        <ButtonGroup
          buttons={["Favourites", "Bookings", "My listings"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
            if (value == 1) {
              getPersonalPosts();
            }
          }}
          containerStyle={{
            width: "80%",
            borderRadius: SPACINGS.XL,
            marginVertical: SPACINGS.LG,
          }}
          selectedTextStyle={{
            fontFamily: "Bitter-Medium",
            fontSize: FONTSIZES.MD,
          }}
          textStyle={{
            fontFamily: "Bitter-Medium",
            fontSize: FONTSIZES.MD,
          }}
          buttonStyle={{
            backgroundColor: COLORS.WHITE,
          }}
          selectedButtonStyle={{
            backgroundColor: COLORS.PRIMARY,
          }}
        />
        {!isLoadingFavs && selectedIndex == 0 && (
          <ScrollView>
            <ProfileCarousel
              navigation={navigation}
              title="Accommodations"
              noDataMessage="You have not saved any accommodations!"
              carouselData={userSavedAccommodations}
              carouselCollectionName={CATEGORIES[0].dbName}
              isFavourite={true}
            />
            <ProfileCarousel
              navigation={navigation}
              title="Experiences"
              noDataMessage="You have not saved any experiences!"
              carouselData={userSavedExperiences}
              carouselCollectionName={CATEGORIES[1].dbName}
              isFavourite={true}
            />
          </ScrollView>
        )}
        {!isLoadingPersonal && selectedIndex == 1 && (
          <ScrollView style={{ width: "80%" }}>
            <H3
              style={{
                marginTop: SPACINGS.MD,
                marginBottom: SPACINGS.LG,
                alignSelf: "center",
              }}
            >
              Current Requests
            </H3>
            <RequestsContainer
              userOwnedAccommodations={userOwnedAccommodations}
              userOwnedExperiences={userOwnedExperiences}
              navigation={navigation}
            />
          </ScrollView>
        )}
        {!isLoadingPersonal && selectedIndex == 2 && (
          <ScrollView>
            <ProfileCarousel
              navigation={navigation}
              title="Accommodations"
              noDataMessage="You have not listed any accommodations!"
              carouselData={userOwnedAccommodations}
              carouselCollectionName={CATEGORIES[0].dbName}
            />
            <ProfileCarousel
              navigation={navigation}
              title="Experiences"
              noDataMessage="You have not listed any experiences!"
              carouselData={userOwnedExperiences}
              carouselCollectionName={CATEGORIES[1].dbName}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.LIGHTACCENT,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACINGS.MD,
    paddingBottom: SPACINGS.LG,
  },
  innerContainer: {
    paddingVertical: SPACINGS.MD,
    backgroundColor: "blue",
    width: "100%",
    alignContent: "center",
  },
  headerText: {
    fontFamily: "Bitter-Bold",
    fontSize: FONTSIZES.LG,
    color: COLORS.DARKBG,
  },
  posts: {
    backgroundColor: COLORS.LIGHTBG,
    width: "100%",
    borderTopRightRadius: SPACINGS.XL,
    borderTopLeftRadius: SPACINGS.XL,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabTitle: {
    color: COLORS.WHITE,
    paddingVertical: SPACINGS.XXS,
    paddingHorizontal: SPACINGS.XXS,
    fontFamily: "Bitter-Bold",
  },
  inactiveTabTitle: {
    color: COLORS.DARKBG,
    paddingVertical: SPACINGS.XXS,
    paddingHorizontal: SPACINGS.XXS,
    fontFamily: "Bitter-Medium",
  },
  activeTabContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginHorizontal: SPACINGS.SM,
    borderRadius: SPACINGS.XL,
    alignContent: "center",
    justifyContent: "center",
  },
  inactiveTabContainer: {
    backgroundColor: COLORS.LIGHTBG,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginHorizontal: SPACINGS.SM,
    borderRadius: SPACINGS.XL,
    alignContent: "center",
    justifyContent: "center",
  },
  tabView: {
    backgroundColor: "red",
  },
  tabViewHeading: {
    marginBottom: SPACINGS.SM,
  },

  // modalPopUp: {
  //   justifyContent: "space-around",
  //   alignItems: "center",
  //   width: "90%",
  //   height: 160,
  //   paddingVertical: SPACINGS.MD,
  //   borderRadius: SPACINGS.XL,
  //   backgroundColor: COLORS.LIGHTACCENT,
  // },

  // modalText: {
  //   fontSize: FONTSIZES.MD,
  // },

  // infoBox: {
  //   width: "80%",
  //   height: 40,
  //   padding: SPACINGS.MD,
  // },

  // modalButtonSection: {
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   width: "80%",
  // },

  // modalButton: {
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: 40,
  //   width: 40,
  //   marginHorizontal: 5,
  //   borderWidth: 1,
  //   borderRadius: 40,
  // },
});
