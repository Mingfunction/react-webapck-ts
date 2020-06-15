import React, { useState } from "react";

function App() {
  const [aa, setAa] = useState("1");
  return (
    <div onClick={() => setAa("2")}>
      <div>{aa}</div>
    </div>
  );
}

export default App;
