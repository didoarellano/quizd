import { Link, Route, Router, Switch } from "wouter";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

import { GameQuestion } from "./pages/GameQuestion";
import { GameResults } from "./pages/GameResults";
import { HostLobby } from "./pages/HostLobby";
import { JoinGame } from "./pages/JoinGame";
import { QuizEditor } from "./pages/QuizEditor";
import { QuizList } from "./pages/QuizList";
import { UserRoles } from "./services/auth";

function App() {
  const { user, signin, signinAnonymously, signout } = useAuth();

  return (
    <Router base={import.meta.env.VITE_BASE_URL}>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/quiz/">My Quizzes</Link>
            </li>
            <li>
              <Link href="/quiz/new">Create a Quiz</Link>
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
        {user && <h3>Hello {user.displayName}</h3>}
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
            <Route path="/" component={QuizList} />
            <Route path="/new">
              <QuizEditor mode="create" />
            </Route>
            <Route path="/:id">
              {(params) => (
                <QuizEditor key={params.id} quizID={params.id} mode="edit" />
              )}
            </Route>
          </Switch>
        </PrivateRoute>

        <PrivateRoute
          path="/host/:id"
          nest={true}
          isAllowed={user?.role === UserRoles.Teacher}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/">
              {({ id }) => <HostLobby key={id} quizID={id} />}
            </Route>
            <Route path="/play">
              {({ id }) => <GameQuestion key={id} quizID={id} />}
            </Route>
            <Route path="/results">
              {({ id }) => <GameResults key={id} quizID={id} />}
            </Route>
          </Switch>
        </PrivateRoute>

        <Route path="/play" nest={true}>
          <Route path="/" component={JoinGame} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
