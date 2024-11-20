import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import {
  EndGameResponse,
  GameStatus,
  LiveGame,
  Player,
} from "../../../shared/game.types";
import { db } from "../services/firebase";
import {
  closeQuestion,
  endGame,
  getOrCreateGame,
  startGame,
  startNewQuestion,
} from "../services/game";

type UseGameOptions = {
  quizID: string | null;
  // Don't show queryKey, queryFn as options;
  queryOptions?: Omit<UseQueryOptions<LiveGame, Error>, "queryKey" | "queryFn">;
};

export function useGameAsHost({ quizID, queryOptions }: UseGameOptions) {
  const queryKey = ["games", quizID];
  const { enabled, ...opts } = queryOptions ?? {};
  const callerEnabled =
    typeof enabled === "function" ? enabled : () => enabled ?? true;
  const queryRes = useQuery({
    ...opts,
    queryKey,
    queryFn: () => getOrCreateGame(quizID).then(({ data }) => data),
    enabled: (query) => {
      return !!quizID && callerEnabled(query);
    },
  });

  const queryClient = useQueryClient();
  const gameID = queryRes?.data?.id;
  useEffect(() => {
    if (!gameID) return;
    const playersCollection = collection(db, "games", gameID, "players");
    return onSnapshot(playersCollection, async (snapshot) => {
      const players: Player[] = snapshot.docs.map(
        (doc) => doc.data() as Player
      );
      queryClient.setQueryData(["games", quizID], {
        ...queryRes.data,
        players,
      });
    });
  }, [gameID, quizID, queryRes, queryClient]);

  return queryRes;
}

type UseStartGameOptions = {
  game: LiveGame | null;
  onStart?: (game: LiveGame) => void;
  onError?: (error: Error, prevData: LiveGame | undefined) => void;
};

export function useStartGame({ game, onStart, onError }: UseStartGameOptions) {
  const queryClient = useQueryClient();
  const queryKey = ["games", game?.quizID];
  return useMutation({
    mutationFn: async () => {
      if (game && game.status === GameStatus.PENDING) {
        return startGame(game.id);
      }
    },
    onMutate: () => {
      const prevData = queryClient.getQueryData<LiveGame>(queryKey);
      if (!game?.quizID || !prevData) return;
      const updatedGame: LiveGame = {
        ...prevData,
        status: GameStatus.ONGOING,
        activeGameChannel: {
          ...prevData.activeGameChannel,
          status: GameStatus.ONGOING,
        },
      };
      queryClient.setQueryData<LiveGame>(queryKey, updatedGame);
      return prevData;
    },
    onError: (error, _vars, prevData) => {
      console.error(error.message);
      queryClient.setQueryData(queryKey, prevData);
      onError?.(error, prevData);
    },
    onSuccess: (_data, _vars, game) => {
      onStart?.(game);
    },
  });
}

type UseGameResultsOptions = {
  quizID: string;
  // Don't show queryKey, queryFn as options;
  queryOptions?: Omit<
    UseQueryOptions<EndGameResponse, Error>,
    "queryKey" | "queryFn"
  >;
};

export function useGameResults({
  quizID,
  queryOptions,
}: UseGameResultsOptions) {
  const queryKey = ["gameResults", quizID];
  const { enabled, ...opts } = queryOptions ?? {};
  const callerEnabled =
    typeof enabled === "function" ? enabled : () => enabled ?? true;

  return useQuery({
    ...opts,
    queryKey,
    queryFn: () => endGame(quizID).then((response) => response.data),
    enabled: (query) => {
      return !!quizID && callerEnabled(query);
    },
  });
}

type UseEndGameOptions = {
  quizID: string;
  onBeforeEndGame?: () => void;
  onEndGame?: (reponse: EndGameResponse) => void;
};

export function useEndGame({
  quizID,
  onBeforeEndGame,
  onEndGame,
}: UseEndGameOptions) {
  const queryClient = useQueryClient();
  const queryKey = ["gameResults", quizID];

  return useMutation({
    mutationFn: (quizID: string) => endGame(quizID),
    onMutate: (quizID) => {
      // add data we already have (quiz meta info) to cache and let caller redirect and render immediately
      const prevData = queryClient.getQueryData<LiveGame>(["games", quizID]);
      if (!prevData) return;
      queryClient.setQueryData(queryKey, {
        quiz: {
          title: prevData.quiz.title,
          description: prevData.quiz.description,
        },
      });
      onBeforeEndGame?.();
      return prevData;
    },
    onError: (error, _vars, prevData) => {
      console.error(error.message);
      queryClient.setQueryData(queryKey, prevData);
    },
    onSuccess: (response) => {
      // add response data to cache instead of invalidating queries to prevent unnecessary requeries
      queryClient.setQueryData(["gameResults", quizID], response.data);
      onEndGame?.(response.data);
    },
  });
}

export function useQuestionRoundMutations({
  quizID,
  onStartNewRound,
  onCloseRound,
}: {
  quizID: string;
  onStartNewRound?: () => void;
  onCloseRound?: () => void;
}) {
  const queryKey = ["games", quizID];
  const queryClient = useQueryClient();
  const cachedGame = queryClient.getQueryData<LiveGame>(queryKey);

  const startNewRound = useMutation({
    mutationFn: async (currentQuestionIndex: number) => {
      if (!cachedGame) return;
      return startNewQuestion(cachedGame.id, currentQuestionIndex).then(
        () => currentQuestionIndex
      );
    },
    onMutate: (currentQuestionIndex) => {
      if (!cachedGame) return;
      const { activeGameChannel } = cachedGame;
      activeGameChannel.currentQuestionIndex = currentQuestionIndex;
      queryClient.setQueryData(queryKey, {
        ...cachedGame,
        activeGameChannel,
      });
      return cachedGame;
    },
    onError: (error, _vars, prevData) => {
      console.error(error.message);
      queryClient.setQueryData(queryKey, prevData);
    },
    onSuccess: () => {
      onStartNewRound?.();
    },
  });

  const closeCurrentRound = useMutation({
    mutationFn: async (questionID: string) => {
      if (!cachedGame) return;
      const currentQuestionAnswer = cachedGame.answerKey[questionID];
      return closeQuestion(cachedGame.id, currentQuestionAnswer);
    },
    onMutate: (questionID) => {
      if (!cachedGame) return;
      const { activeGameChannel } = cachedGame;
      activeGameChannel.currentQuestionAnswer =
        cachedGame.answerKey[questionID];
      queryClient.setQueryData(queryKey, {
        ...cachedGame,
        activeGameChannel,
      });
      return cachedGame;
    },
    onError: (error, _vars, prevData) => {
      console.error(error.message);
      queryClient.setQueryData(queryKey, prevData);
    },
    onSuccess: () => {
      onCloseRound?.();
    },
  });

  return { startNewRound, closeCurrentRound };
}
