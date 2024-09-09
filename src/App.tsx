import { useState, useEffect } from "react";
import { Link, Route, Router, Switch } from "wouter";
import { signin, signout, onAuthChange } from "./services/auth";
import type { User } from "firebase/auth";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthChange((user: User | null) => {
      setUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <Router base={import.meta.env.VITE_BASE_URL}>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/quiz/new">Create a Quiz</Link>
            </li>
            <li>
              <Link href="/play">Play</Link>
            </li>
            <li>
              {!user ? (
                <button onClick={signin}>Sign In</button>
              ) : (
                <button onClick={signout}>Sign Out</button>
              )}
            </li>
          </ul>
        </nav>
        {user && <h3>Hello {user.displayName}</h3>}
      </header>

      <Switch>
        <PrivateRoute
          path="/quiz"
          nest={true}
          isAllowed={true}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/new">{<h1>Create a new Quiz</h1>}</Route>
            <Route path="/:id">
              {(params) => <h1>Edit Quiz ID: {params.id}</h1>}
            </Route>
          </Switch>
        </PrivateRoute>

        <Route path="/play">
          <h1>Play</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
