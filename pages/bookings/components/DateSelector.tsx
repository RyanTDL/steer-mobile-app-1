import React, { useState } from "react";
import { TouchableOpacity, Modal, View, StyleSheet } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import COLORS from "../../../config/COLORS";
import H3 from "../../../custom_components/typography/H3";
import SPACINGS from "../../../config/SPACINGS";
import FONTSIZES from "../../../config/FONTSIZES";

interface DateSelectorProps {
  setNumNights: (value: number) => void;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  occupiedDates?: Date[];
}

export default function DateSelector(props: DateSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const testDate: Date = new Date(2023, 10, 23);
  // TODO: Replace this with actual disabled dates from firestore

  var areDatesSelected = selectedStartDate !== null && selectedEndDate !== null;

  const handleDateSelect = (date: Date) => {
    if (!selectedStartDate) {
      setSelectedStartDate(date);
    } else {
      setSelectedEndDate(date);
      const newNumNights = Math.floor(
        (date.getTime() - selectedStartDate.getTime()) / (1000 * 3600 * 24)
      );
      props.setNumNights(newNumNights);
      props.setStartDate(selectedStartDate);
      props.setEndDate(date);
      setShowCalendar(false);
    }
  };

  const handleCheckInPress = () => {
    setShowCalendar(true);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleCalendarClose = () => {
    setShowCalendar(false);
  };

  const formatDate = (date: Date | null) => {
    return date ? moment(date).format("DD MMM YYYY") : "  --  ";
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCheckInPress}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <H3 style={styles.inputText}>
            {formatDate(selectedStartDate)} to {formatDate(selectedEndDate)}
          </H3>
        </View>
      </TouchableOpacity>

      <Modal visible={showCalendar} transparent={false} animationType="slide">
        <View style={styles.calendarModal}>
          <CalendarPicker
            onDateChange={(date) => handleDateSelect(date?.toDate() || null)}
            disabledDates={props.occupiedDates ?? []}
            allowRangeSelection={true}
            minDate={new Date()}
            textStyle={{
              fontFamily: "Bitter-Regular",
            }}
            selectedDayColor={COLORS.PRIMARY}
          />
          <TouchableOpacity
            onPress={handleCalendarClose}
            disabled={!areDatesSelected}
          >
            <View
              style={areDatesSelected ? styles.button : styles.disabledButton}
            >
              <H3>Confirm</H3>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarModal: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "lightgray",
    padding: SPACINGS.MD,
    alignItems: "center",
    margin: SPACINGS.MD,
    borderRadius: SPACINGS.XL,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACINGS.MD,
    alignItems: "center",
    margin: SPACINGS.MD,
    borderRadius: SPACINGS.XL,
  },
  inputText: {
    color: COLORS.BLACK,
    fontSize: FONTSIZES.MD,
    fontFamily: "Bitter-Regular",
    paddingLeft: SPACINGS.SM,
  },
});
