import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import DateSelector from "./DateSelector";
import SPACINGS from "../../../config/SPACINGS";
import COLORS from "../../../config/COLORS";
import H3 from "../../../custom_components/typography/H3";
import BodyText from "../../../custom_components/typography/BodyText";
import NumberToggle from "../../post/components/NumberToggle";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firebaseAuth, firestore } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface AccommodationBookingCardProps {
  id: string;
  price: number;
  guestCapacity: number;
  navigation: NativeStackNavigationProp<any>;
}

export default function AccommodationBookingCard(
  props: AccommodationBookingCardProps
) {
  const listingId = props.id;
  const unitPrice = props.price;
  const [totalPrice, setTotalPrice] = useState(props.price);
  const [numNights, setNumNights] = useState(0);
  const [numGuests, setNumGuests] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [readyToBook, setReadyToBook] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      setReadyToBook(true);
    } else {
      setReadyToBook(false);
    }
  }, [numNights]);

  const handleBookPress = async () => {
    const bookingsSubcollectionRef = collection(
      firestore,
      "accommodations",
      listingId,
      "bookings"
    );
    const newBookingRef = await addDoc(bookingsSubcollectionRef, {
      startDate: startDate,
      endDate: endDate,
      occupiedDates: getDatesBetween(
        startDate ?? new Date(),
        endDate ?? new Date()
      ),
      numNights: numNights,
      numGuests: numGuests,
      totalPrice: totalPrice,
      guestId: user?.uid ?? "requester's id could not be obtained",
      requestTime: new Date(),
      isApproved: false,
      paymentStatus: "pending",
    });
    props.navigation.navigate("RequestConfirmation", {
      navigation: props.navigation,
    });
  };

  function getDatesBetween(startDate: Date, endDate: Date): Date[] {
    let datesArray: Date[] = [];
    let currentDate: Date = new Date(startDate);

    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
  }

  const getOccupiedDates = async () => {
    const fetchedOccupiedDates: Date[] = [];
    const q = query(
      collection(firestore, "accommodations", listingId, "bookings"),
      where("startDate", ">=", new Date())
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((bookingDoc) => {
      const currDoc = bookingDoc.data();
      fetchedOccupiedDates.concat(currDoc.occupiedDates);
    });
    setOccupiedDates(fetchedOccupiedDates);
  };

  useEffect(() => {
    setTotalPrice(unitPrice * numNights);
  }, [numNights]);

  useEffect(() => {
    getOccupiedDates();
  }, []);

  return (
    <View style={{ width: "100%" }}>
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
        <H3>Dates:</H3>
        <View>
          <DateSelector
            setNumNights={setNumNights}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            occupiedDates={occupiedDates}
          />
          <BodyText style={styles.hintText}>Min: 1 night</BodyText>
        </View>
      </View>
      <View style={styles.container}>
        <H3>Total Price: </H3>
        <View>
          <H3 style={styles.totalPriceText}> ${totalPrice}</H3>
          <BodyText style={styles.hintText}>
            ${unitPrice} * {numNights} nights
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
});
