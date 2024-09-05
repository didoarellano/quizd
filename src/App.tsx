import { useState, useEffect } from "react";
import { onSnapshot, addDoc, collection } from "firebase/firestore";
import { db } from "./services/firebase";

type Bleh = {
  id: string;
  timestamp: string;
};

async function addBleh() {
  try {
    await addDoc(collection(db, "bleh"), {
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error(e);
  }
}

function App() {
  const [blehs, setBlehs] = useState<Bleh[] | []>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bleh"), (snapshot) => {
      let docs: Bleh[] = [];
      snapshot.forEach((doc) => {
        let _bleh: Bleh = {
          id: doc.id,
          timestamp: doc.data().timestamp,
        };
        docs.push(_bleh);
      });
      setBlehs(docs);
    });

    return unsub;
  }, []);

  return (
    <>
      <button onClick={addBleh}>bleh</button>
      <ol>
        {blehs.map((bleh) => {
          return <li key={bleh.id}>{bleh.timestamp}</li>;
        })}
      </ol>
    </>
  );
}

export default App;
