import { useState, useEffect } from "react";
import { onSnapshot, addDoc, collection } from "firebase/firestore";
import { db } from "./services/firebase";
import { signin, signout, onAuthChange } from "./services/auth";
import type { User } from "firebase/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [blehs, setBlehs] = useState<Bleh[] | []>([]);

  useEffect(() => {
    const unsubscribeBleh = onSnapshot(collection(db, "bleh"), (snapshot) => {
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

    const unsubscribeAuth = onAuthChange((user: User | null) => {
      setUser(user);
    });

    return () => {
      unsubscribeBleh();
      unsubscribeAuth();
    };
  }, []);

  return (
    <>
      {!user ? (
        <button onClick={signin}>Sign In</button>
      ) : (
        <div>
          <p>Hello {user.displayName}</p>
          <button onClick={signout}>Sign Out</button>
        </div>
      )}

      <hr />

      {user && (
        <>
          <button onClick={addBleh}>bleh</button>
          <ol>
            {blehs.map((bleh) => {
              return <li key={bleh.id}>{bleh.timestamp}</li>;
            })}
          </ol>
        </>
      )}
    </>
  );
}

export default App;
