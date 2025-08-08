import React from "react";

const chapatiUrl = "/chat.jpg"; // Place your uploaded image in /public as chat.jpg

export default function App() {
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#FDF5E6", // light warm beige
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
    overflow: "hidden",
  };

  const textContainerStyle = {
    flex: 1,
    paddingLeft: "10%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const titleStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "#4B2E2E",
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: "1.25rem",
    color: "#4B2E2E",
    marginTop: "1rem",
    marginBottom: "2rem",
    maxWidth: "400px",
  };

  const buttonStyle = {
    backgroundColor: "#A45C27",
    color: "white",
    border: "none",
    padding: "14px 28px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    width: "fit-content",
  };

  const imageContainerStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle = {
    maxWidth: "80%",
    height: "auto",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  };

  return (
    <div style={containerStyle}>
      <div style={textContainerStyle}>
        <h1 style={titleStyle}>Wabi Roti</h1>
        <p style={subtitleStyle}>
          Celebrating the art of imperfect chapathi
        </p>
        <button style={buttonStyle}>Upload & Analyze</button>
      </div>
      <div style={imageContainerStyle}>
        <img src={chapatiUrl} alt="Chapathi" style={imageStyle} />
      </div>
    </div>
  );
}
