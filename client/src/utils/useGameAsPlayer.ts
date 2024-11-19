import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { updateProfile, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect } from "react";
import { JoinGameResponse } from "../../../shared/game.types";
import { signinAnonymously } from "../services/auth";
import { auth, db, functions } from "../services/firebase";

const joinGame = httpsCallable<string, JoinGameResponse>(functions, "joinGame");

export function useGameAsPlayer(pin: string): UseQueryResult<JoinGameResponse> {
  const queryRes = useQuery({
    queryKey: ["games", pin],
    queryFn: async () => {
      const { data } = await joinGame(pin);
      if (data.isNewPlayer) {
        const user = auth.currentUser as User;
        await updateProfile(user, {
          displayName: data.displayName,
        });
        user.reload();
      }
      return data;
    },
    enabled: !!auth.currentUser && !!pin,
  });

  useEffect(() => {
    if (!auth.currentUser) signinAnonymously();
  }, []);

  const queryClient = useQueryClient();
  useEffect(() => {
    const gameID = queryRes?.data?.gameID;
    if (!gameID) return;
    const activeGameChannelRef = doc(db, "activeGamesChannel", gameID);
    return onSnapshot(activeGameChannelRef, async (snapshot) => {
      const channelData = snapshot.data();
      if (!channelData) return;
      queryClient.setQueryData(["games", pin], {
        ...queryRes.data,
        activeGameChannel: channelData,
      });
    });
  }, [pin, queryRes, queryClient]);

  return queryRes;
}

export function useSaveAnswerMutation({
  docPath,
  pin,
}: {
  docPath: string;
  pin: string;
}) {
  const queryKey = ["games", pin];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionID,
      answerID,
    }: {
      questionID: string;
      answerID: string;
    }) => {
      const playerDocRef = doc(db, docPath);
      const snapshot = await getDoc(playerDocRef);
      if (!snapshot.exists()) {
        throw new Error(`Document at path ${docPath} does not exist.`);
      }
      return updateDoc(playerDocRef, {
        [`answers.${questionID}`]: answerID,
      });
    },
    onMutate: ({ questionID, answerID }) => {
      const prevData = queryClient.getQueryData<JoinGameResponse>(queryKey);
      if (!prevData) return;
      const answers = prevData.answers;
      answers[questionID] = answerID;
      queryClient.setQueryData(queryKey, {
        ...prevData,
        answers,
      });
      return prevData;
    },
    onError: (error, _vars, prevData) => {
      console.error(error.message);
      queryClient.setQueryData(queryKey, prevData);
    },
  });
}
