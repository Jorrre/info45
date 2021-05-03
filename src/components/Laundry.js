import axios from "axios";
import { useEffect, useState } from "react";

function Laundry() {
  const [refresh, setRefresh] = useState(true);
  const [token, setToken] = useState("");
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const refreshInterval = 60000; // 1 minute
    const interval = setInterval(() => {
      setRefresh(!refresh);
    }, refreshInterval);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const url =
      "https://api.mielelogic.com/v3/Country/NO/Laundry/9106/laundrystates?language=en"; // Laundry at Berg studentby
    const config = {};
    axios
      .get(url, config)
      .catch(() => {})
      .then((machines) => setMachines(machines));
  }, [refresh]);

  return <></>;
}

export default Laundry;
