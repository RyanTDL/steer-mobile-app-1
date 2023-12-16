import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import SPACINGS from "../../../config/SPACINGS";
import COLORS from "../../../config/COLORS";
import H3 from "../../../custom_components/typography/H3";
import BodyText from "../../../custom_components/typography/BodyText";
import NumberToggle from "../../post/components/NumberToggle";
import { addDoc, collection } from "firebase/firestore";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface ExperienceBookingCardProps {
  id: string;
  price: number;
  guestCapacity: number;
  navigation: NativeStackNavigationProp<any>;
}

export default function ExperienceBookingCard(
  props: ExperienceBookingCardProps
) {
  const listingId = props.id;
  const unitPrice = props.price;
  const [totalPrice, setTotalPrice] = useState(props.price);
  const [numGuests, setNumGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<any>("date");
  const [show, setShow] = useState(false);
  const [dateString, setDateString] = useState("");
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [readyToBook, setReadyToBook] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    const year = currentDate?.getFullYear();
    const month = (currentDate?.getMonth() ?? 0) + 1; // getMonth() is zero-based
    const day = currentDate?.getDate();
    const formattedDate = `${day}-${month}-${year}`;
    setShow(false);
    setSelectedDate(currentDate);
    setDateString(formattedDate);
    setReadyToBook(true);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const handleBookPress = async () => {
    const bookingsSubcollectionRef = collection(
      firestore,
      "experiences",
      listingId,
      "bookings"
    );
    const newBookingRef = await addDoc(bookingsSubcollectionRef, {
      numGuests: numGuests,
      totalPrice: totalPrice,
      selectedDate: selectedDate,
      guestId: user?.uid ?? "requester's id could not be obtained",
      requestTime: new Date(),
      isApproved: false,
      paymentStatus: "pending",
    });
    props.navigation.navigate("RequestConfirmation", {
      navigation: props.navigation,
    });
  };

  useEffect(() => {
    setTotalPrice(unitPrice * numGuests);
  }, [numGuests]);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.container}>
        <H3>Date: </H3>
        <View style={styles.datePicker}>
          {selectedDate && <H3>{dateString}</H3>}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate ?? new Date()}
              mode={mode}
              onChange={onChange}
            />
          )}
          {!show && (
            <Pressable onPress={showDatepicker}>
              <H3 style={{ color: COLORS.PRIMARY }}>Select</H3>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <H3>Guests:</H3>
          <View>
            <NumberToggle
              numItems={numGuests}
              setNumItems={setNumGuests}
              min={1}
              max={props.guestCapacity}
            />
            <BodyText style={styles.hintText}>
              Max: {props.guestCapacity} guests
            </BodyText>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <H3>Total Price: </H3>
        <View>
          <H3 style={styles.totalPriceText}> ${totalPrice}</H3>
          <BodyText style={styles.hintText}>
            ${unitPrice} * {numGuests} pax
          </BodyText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleBookPress}
          disabled={!readyToBook}
          style={readyToBook ? styles.button : styles.disabledButton}
        >
          <H3>Book now!</H3>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACINGS.MD,
    margin: SPACINGS.MD,
    backgroundColor: COLORS.LIGHTBG,
    borderRadius: SPACINGS.XL,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    justifyContent: "center",
  },
  totalPriceText: {
    color: COLORS.PRIMARY,
    textAlign: "right",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACINGS.MD,
    alignItems: "center",
    margin: SPACINGS.MD,
    borderRadius: SPACINGS.XL,
  },
  disabledButton: {
    backgroundColor: "lightgray",
    padding: SPACINGS.MD,
    alignItems: "center",
    margin: SPACINGS.MD,
    borderRadius: SPACINGS.XL,
  },
  hintText: {
    textAlign: "right",
  },
  datePicker: {
    alignItems: "flex-end",
  },
});
