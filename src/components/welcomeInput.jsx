import React, { useEffect, useState } from "react";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";
import { firebase } from "../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import "../App.css";

export const WelcomeInput = () => {
  const [name, setName] = useState("");
  const [entradas, setEntradas] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.setItem("username", name);
    navigate("/home");

    const docRef = doc(firebase, "fulbito", "fulbito");
    try {
      await updateDoc(docRef, {
        Entradas: [...entradas, name],
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    setDisabled(name.length === 0);
  }, [name]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(firebase, "fulbito"));
    querySnapshot.forEach((doc) => {
      if (doc.id === "fulbito") {
        const entradasData =
          doc?._document?.data?.value?.mapValue?.fields?.Entradas?.arrayValue
            ?.values ?? [];

        let entardasFiltered =
          entradasData?.length > 0
            ? entradasData.map((jugador) => jugador.stringValue)
            : entradasData;

        setEntradas(entardasFiltered);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #000000, #333333)",
      }}
    >
      <h1 style={{ padding: 12, color: "white" }}>Fulbito App</h1>
      <h2 style={{ padding: 12, color: "white", fontSize: "1.2rem" }}>
        Ingresa tu nombre para empezar
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <input
          style={{
            backgroundColor: "transparent",
            color: "white",
            padding: 16,
            border: "1px solid white",
            borderRadius: 4,
            fontSize: "1rem",
          }}
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ArrowCircleRightOutlinedIcon
          style={{
            fontSize: "2rem",
            color: `${disabled ? "#ffffff45" : "white"}`,
            pointerEvents: `${disabled ? "none" : "all"}`,
          }}
          onClick={handleClick}
        />
      </div>
      <SportsSoccerIcon
        className="soccer-icon"
        style={{
          fontSize: "3rem",
          color: "white",
          marginTop: 50,
          paddingRight: 6,
        }}
      />
    </div>
  );
};
