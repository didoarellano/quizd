import { useState } from "react";
import { Link, Route, Router, Switch } from "wouter";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

import { UserRoles } from "./services/auth";
import { PlayQuiz } from "./pages/PlayQuiz";
import { QuizEditor } from "./pages/QuizEditor";
import { HostQuiz } from "./pages/HostQuiz";
import { functions } from "./services/firebase";
import { httpsCallable } from "firebase/functions";

const ping = httpsCallable(functions, "ping");

function App() {
  const { user, signin, signinAnonymously, signout } = useAuth();
  const [hits, setHits] = useState(0);

  return (
    <Router base={import.meta.env.VITE_BASE_URL}>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/quiz/new">Create a Quiz</Link>
            </li>
            <li>
              <Link href="/play/jj8MgM10ezL8zCPKQ39A">Play</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <button onClick={signin}>Sign In</button>
                </li>
                <li>
                  <button onClick={signinAnonymously}>
                    Sign In Anonymously
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={signout}>Sign Out</button>
              </li>
            )}
          </ul>
        </nav>
        {user && <h3>Hello {user.displayName ?? "Anon"}</h3>}
      </header>

      <div>
        <button
          onClick={async () => {
            const result = await ping();
            setHits(result.data.hits);
          }}
        >
          Hit
        </button>
        <p>{hits}</p>
      </div>

      <Switch>
        <PrivateRoute
          path="/quiz"
          nest={true}
          isAllowed={user?.role === UserRoles.Teacher}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/new">
              <QuizEditor />
            </Route>
            <Route path="/:id">
              {(params) => <QuizEditor key={params.id} quizID={params.id} />}
            </Route>
            <Route path="/:id/host">
              {(params) => <HostQuiz key={params.id} quizID={params.id} />}
            </Route>
          </Switch>
        </PrivateRoute>

        <Route path="/play/:id">
          {(params) => <PlayQuiz key={params.id} quizID={params.id} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
