import createEnturService from "@entur/sdk";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const service = createEnturService({
  clientName: "jørgen_reimers-ob45_infoskjerm",
});

function BusDepartures() {
  const [refresh, setRefresh] = useState(true);
  const [departures, setDepartures] = useState([]);
  const [downHill, setDownhill] = useState([]);
  const [upHill, setUphill] = useState([]);

  useEffect(() => {
    const refreshInterval = 5000;
    const interval = setInterval(() => {
      setRefresh(!refresh);
    }, refreshInterval);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const stopID = "NSR:StopPlace:43666"; // Berg studentby
    const timeRange = 1800; // 1 hour

    service
      .getDeparturesFromStopPlace(stopID, { timeRange: timeRange })
      .then((departures) => {
        setDepartures(departures);
      });
  }, [refresh]);

  useEffect(() => {
    const uphillID = "NSR:Quay:74952"; // Towards Moholt/Strindheim
    const downhillID = "NSR:Quay:74954"; // Towards Gløshaugen/Lerkendal

    setUphill(departures.filter((departure) => departure.quay.id === uphillID));
    setDownhill(
      departures.filter((departure) => departure.quay.id === downhillID)
    );
  }, [departures]);

  return (
    <div className="busDepartures">
      <h2>Mot Gløs/Lerkendal</h2>
      <DepartureTable departures={downHill} />
      <h2>Mot Moholt/Strindheim</h2>
      <DepartureTable departures={upHill} />
    </div>
  );
}

function DepartureTable(props) {
  const { departures } = props;
  return (
    <table className="busDepartureTable">
      <tr>
        <th>Linje</th>
        <th>Destinasjon</th>
        <th>Avgang</th>
      </tr>
      {departures.map((departure) => (
        <DepartureTableRow
          key={departure.serviceJourney.id}
          departure={departure}
        />
      ))}
    </table>
  );
}

function DepartureTableRow(props) {
  const { departure } = props;
  const line = departure.serviceJourney.journeyPattern.line.publicCode;
  const destination = departure.destinationDisplay.frontText;
  const departureTime = formatDepartureTime(departure.expectedDepartureTime);

  return (
    <tr className="busDepartureTableRow">
      <td>{line}</td>
      <td>{destination} </td>
      <td>{departureTime}</td>
    </tr>
  );
}

function formatDepartureTime(ISOTime) {
  const now = DateTime.local();
  const departureTime = DateTime.fromISO(ISOTime);
  const minDiff = Math.floor(
    departureTime.diff(now, "minutes").toObject().minutes
  );

  if (minDiff === 0) return "Nå";
  else if (minDiff <= 10) return minDiff + " min";
  else return departureTime.toFormat("HH:mm");
}

export default BusDepartures;
