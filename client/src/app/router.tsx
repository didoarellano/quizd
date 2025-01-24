import { GameResults } from "@/app/pages/GameResults";
import { HostLobby } from "@/app/pages/HostLobby";
import { HostQuestion } from "@/app/pages/HostQuestion";
import { JoinGame } from "@/app/pages/JoinGame";
import { PlayerGameScreen } from "@/app/pages/PlayerGameScreen";
import { QuizEditor } from "@/app/pages/QuizEditor";
import { QuizList } from "@/app/pages/QuizList";
import { UserRoles } from "@/services/auth";
import { useAuth } from "@/utils/AuthContext";
import { PrivateRoute } from "@/utils/PrivateRoute";
import { Route, Router, Switch } from "wouter";

export function AppRouter() {
  const { user } = useAuth();

  return (
    <Router base={import.meta.env.VITE_BASE_URL}>
      <Switch>
        <PrivateRoute
          path="/quiz"
          nest={true}
          isAllowed={user?.role === UserRoles.Host}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/" component={QuizList} />
            <Route path="/new">
              <QuizEditor mode="create" />
            </Route>
            <Route path="/:id">
              {({ id }) => <QuizEditor key={id} quizID={id} mode="edit" />}
            </Route>
          </Switch>
        </PrivateRoute>

        <PrivateRoute
          path="/host"
          nest={true}
          isAllowed={user?.role === UserRoles.Host}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/:id">
              {({ id }) => <HostLobby key={id} quizID={id} />}
            </Route>
            <Route path="/:id/play">
              {({ id }) => <HostQuestion key={id} quizID={id} />}
            </Route>
            <Route path="/:id/results">
              {({ id }) => <GameResults key={id} quizID={id} />}
            </Route>
          </Switch>
        </PrivateRoute>

        <Route path="/play" nest={true}>
          <Route path="/" component={JoinGame} />
          <Route path="/:pin">
            {({ pin }) => <PlayerGameScreen key={pin} pin={pin} />}
          </Route>
        </Route>
      </Switch>
    </Router>
  );
}
