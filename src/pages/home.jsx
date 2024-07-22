import React, { useEffect, useState } from "react";
import { firebase } from "../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Jugadores } from "../shared/constants";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AlarmIcon from "@mui/icons-material/Alarm";
import { ClipLoader } from "react-spinners";

export const Home = () => {
  const [pozoValue, setPozoValue] = useState(0);
  const [jugadoresSelected, setJugadoresSelected] = useState([]);
  const [ultimaModificacion, setUltimaModificacion] = useState("");
  const [jugadorNombre, setJugadorNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    username && setJugadorNombre(username);
  }, [username]);

  const fetchData = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(firebase, "fulbito"));
    querySnapshot.forEach((doc) => {
      if (doc.id === "fulbito") {
        const pecherasData =
          doc?._document?.data?.value?.mapValue?.fields?.Pecheras?.arrayValue
            ?.values ?? [];
        const pozoData =
          doc?._document?.data?.value?.mapValue?.fields?.Pozo.stringValue;

        const ultimaModificacionData =
          doc?._document?.data?.value?.mapValue?.fields?.UltimaModificacion
            .stringValue;

        let pecherasFiltered =
          pecherasData?.length > 0
            ? pecherasData.map((jugador) => jugador.stringValue)
            : pecherasData;

        setPozoValue(pozoData);
        setJugadoresSelected(pecherasFiltered);
        setUltimaModificacion(ultimaModificacionData);
        setLoading(false);
      }
    });
  };

  const handleUpdatePozo = async () => {
    setLoading(true);
    const docRef = doc(firebase, "fulbito", "fulbito");
    try {
      await updateDoc(docRef, {
        Pozo: pozoValue,
        UltimaModificacion: jugadorNombre,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    fetchData();
  };

  const handleUpdatePecheras = async () => {
    setLoading(true);
    const docRef = doc(firebase, "fulbito", "fulbito");
    try {
      await updateDoc(docRef, {
        Pecheras: jugadoresSelected,
        UltimaModificacion: jugadorNombre,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    fetchData();
  };

  const handleResetPecheras = async () => {
    setLoading(true);
    const docRef = doc(firebase, "fulbito", "fulbito");
    try {
      await updateDoc(docRef, {
        Pecheras: [],
        UltimaModificacion: jugadorNombre,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    fetchData();
  };

  const handleCheckboxChange = (jugadorName) => (event) => {
    if (event.target.checked) {
      setJugadoresSelected([...jugadoresSelected, jugadorName]);
    } else {
      setJugadoresSelected(
        jugadoresSelected.filter((name) => name !== jugadorName)
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        background: "linear-gradient(to bottom, #000000, #333333)",
        height: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        overflow: "hidden",
        color: "white",
        maxHeight: "100vh",
      }}
    >
      {loading ? (
        <ClipLoader color="#fff" />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                justifyContent: "center",
                gap: 8,
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <p style={{ fontSize: "2rem", margin: 0, marginTop: "10px" }}>
                Pozo acumulado
              </p>
              <FormControl style={{ width: "50%" }}>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <span style={{ color: "white" }}>
                        <AttachMoneyIcon style={{ paddingTop: 14 }} />
                      </span>
                    </InputAdornment>
                  }
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "2rem",
                    textAlign: "center",
                    color: "white",
                    appearance: "textfield",
                  }}
                  className="inputPozo"
                  value={pozoValue ?? "-"}
                  type="number"
                  onChange={(e) => setPozoValue(e.target.value)}
                />
              </FormControl>
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid white",
                  padding: 8,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={handleUpdatePozo}
              >
                Actualizar pozo
              </button>
            </div>
          </div>
          <span
            style={{
              height: "1px",
              width: "90%",
              backgroundColor: "white",
              marginTop: "10px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 10,
              marginTop: -30,
            }}
          >
            <p style={{ fontSize: "2rem" }}>
              Lista pecheras <AccessibilityIcon style={{ paddingTop: 12 }} />
            </p>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "top",
                flexWrap: "wrap",
                paddingInline: 8,
                marginTop: -20,
                marginBottom: 20,
              }}
            >
              {Jugadores.map((jugador) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jugadoresSelected?.includes(jugador.name)}
                      onChange={handleCheckboxChange(jugador.name)}
                    />
                  }
                  label={jugador.name}
                  key={jugador.name}
                />
              ))}
            </FormGroup>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: -10,
              }}
            >
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid white",
                  padding: 8,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={handleUpdatePecheras}
              >
                Actualizar lista
              </button>
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid white",
                  padding: 8,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={handleResetPecheras}
              >
                Resetear lista
              </button>
            </div>
          </div>
          <span
            style={{
              height: "1px",
              width: "90%",
              backgroundColor: "white",
              marginTop: "10px",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <AlarmIcon style={{ paddingTop: 12 }} />{" "}
            <p
              style={{ color: "white", paddingBottom: 10 }}
            >{`Ultima modificación | ${ultimaModificacion}`}</p>
          </div>
        </>
      )}
    </div>
  );
};
