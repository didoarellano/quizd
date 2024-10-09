import { httpsCallable } from "firebase/functions";
import { useEffect, useRef, useState } from "react";
import { functions } from "../services/firebase";

import { Link, useLocation, useRouter } from "wouter";

const createGame = httpsCallable(functions, "createGame");

export function ActiveGame({ quizID }: { quizID: string }): JSX.Element {
  const activeGame = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();
  const { base } = useRouter();

  let quizData: Quiz;
  if (activeGame.current) {
    quizData = activeGame.current.quizData;
  }

  useEffect(() => {
    setIsLoading(true);
    createGame(quizID)
      .then(({ data }) => {
        activeGame.current = data;
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1>Host Quiz: {quizID} </h1>
      {isLoading ? (
        <p>...</p>
      ) : (
        <div>
          <h2>{quizData.title}</h2>
          <p>{quizData.description}</p>
          <p>Go to: {window.location.host + base.replace("quiz", "play")}</p>
          <p>Enter PIN: {activeGame.current?.pin}</p>
          <Link href={`${location}?q=0`}>Start Game</Link>
          <div>
            <h3>Players</h3>
          </div>
        </div>
      )}
    </>
  );
}
