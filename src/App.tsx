import { Link, Route, Router, Switch } from "wouter";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

import { UserRoles } from "./services/auth";
import { CreateQuiz } from "./pages/CreateQuiz";
import { PlayQuiz } from "./pages/PlayQuiz";

function App() {
  const { user, signin, signinAnonymously, signout } = useAuth();

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
              <CreateQuiz />
            </Route>
            <Route path="/:id">
              {(params) => <CreateQuiz key={params.id} quizID={params.id} />}
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
