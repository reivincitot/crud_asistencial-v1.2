import { useEffect, useState } from "react";
import instance from "../../axiosConfig";

const RegionForm = ({ paisSeleccionado}) => {
  const [setRegiones] = useState([]);

  useEffect(() => {
    if (paisSeleccionado) {
      instance
        .get(`regiones/?pais=${paisSeleccionado}`)
        .then((response) => {
          setRegiones(response.data);
        })
        .catch((error) => console.error("Error fetching regiones:", error));
    }
  }, [paisSeleccionado, setRegiones]);

  return {};
};

export default RegionForm;
