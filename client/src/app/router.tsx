import { GameResults } from "@/app/pages/GameResults";
import { Home } from "@/app/pages/Home";
import { HostLobby } from "@/app/pages/HostLobby";
import { HostQuestion } from "@/app/pages/HostQuestion";
import { JoinGame } from "@/app/pages/JoinGame";
import { PlayerGameScreen } from "@/app/pages/PlayerGameScreen";
import { QuizCreate } from "@/app/pages/QuizCreate";
import { QuizEdit } from "@/app/pages/QuizEdit";
import { QuizList } from "@/app/pages/QuizList";
import { UserRoles } from "@/services/auth";
import { useAuth } from "@/utils/AuthContext";
import { PrivateRoute } from "@/utils/PrivateRoute";
import { Route, Router, Switch } from "wouter";

export function AppRouter() {
  const { user } = useAuth();

  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />

        <PrivateRoute
          path="/quiz"
          nest={true}
          isAllowed={user?.role === UserRoles.Host}
          redirectTo="/play"
          replace={true}
        >
          <Switch>
            <Route path="/" component={QuizList} />
            <Route path="/new" component={QuizCreate} />
            <Route path="/:id">
              {({ id }) => <QuizEdit key={id} quizID={id} />}
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
