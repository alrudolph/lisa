import React, { useContext } from "react";
import styled from "styled-components";
import { DatesContext } from "../../../contexts/datesContext";

const TextArea = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 5px 0;
`;

const Text = styled.p`
  margin: 5px 0;
`;
const convertDate = (d: string): Date => {
  const [year, month, day] = d.split('-')
  return new Date(+year, +month - 1, +day);
};

const nextDate = (initial: Date, n: number) => {
  return new Date(initial.getTime() + 24 * 60 * 60 * 1000 * n);
};

export default function MobileDisplay({ week, showWeekNumber }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dates = useContext(DatesContext).map((d) => convertDate(d));

  const newDate = dates[week];
  const endDate =
    week + 1 < dates.length
      ? nextDate(dates[week + 1], -1)
      : convertDate("2020-12-27");

  return (
    <TextArea>
      {showWeekNumber ? <Text>Week {week + 1}/52</Text> : null}
      {newDate !== null ? (
        <Text>
          {months[newDate.getMonth()]} {newDate.getDate()} -{" "}
          {months[endDate.getMonth()]} {endDate.getDate()}{" "}
        </Text>
      ) : null}
    </TextArea>
  );
}
