import {
  deleteQuizByID,
  generateID,
  getQuiz,
  getQuizzes,
  saveNewQuiz,
  updateQuiz,
} from "@/services/quiz";
import { Quiz } from "@/types/quiz";
import { parseQuiz } from "@/utils/markdown-parser";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DocumentReference, DocumentSnapshot } from "firebase/firestore";

type UseQuizzesOptions = {
  userID: string | null;
  // Don't show queryKey, queryFn as options;
  queryOptions?: Omit<UseQueryOptions<Quiz[], Error>, "queryKey" | "queryFn">;
};

export function useQuizzes({ userID, queryOptions }: UseQuizzesOptions) {
  const queryKey = ["quizzes"];
  const { enabled, ...opts } = queryOptions ?? {};
  const callerEnabled =
    typeof enabled === "function" ? enabled : () => enabled ?? true;

  return useQuery({
    ...opts,
    queryKey,
    queryFn: async () => getQuizzes(userID as string),
    enabled: (query) => {
      return !!userID && callerEnabled(query);
    },
  });
}

type UseQuizOptions = {
  quizID: string | null;
  userID: string | null;
  // Don't show queryKey, queryFn as options;
  queryOptions?: Omit<
    UseQueryOptions<{ docSnap: DocumentSnapshot<Quiz>; quiz: Quiz }, Error>,
    "queryKey" | "queryFn"
  >;
};

export function useQuiz({ quizID, userID, queryOptions }: UseQuizOptions) {
  const queryKey = ["quizzes", quizID];
  const { enabled, ...opts } = queryOptions ?? {};
  const callerEnabled =
    typeof enabled === "function" ? enabled : () => enabled ?? true;

  return useQuery({
    ...opts,
    queryKey,
    queryFn: () => getQuiz(quizID as string, userID as string),
    enabled: (query) => !!userID && !!quizID && callerEnabled(query),
  });
}

type UseSaveNewQuizMutationConfig = Omit<
  // Don't show mutationFn as an option
  UseMutationOptions<
    DocumentReference<Quiz>,
    Error,
    { userID: string; mdText: string }
  >,
  "mutationFn"
>;

export function useSaveNewQuiz(mutationConfig?: UseSaveNewQuizMutationConfig) {
  const queryClient = useQueryClient();
  const queryKey = ["quizzes"];
  return useMutation({
    ...mutationConfig,
    mutationFn: ({ userID, mdText }: { userID: string; mdText: string }) => {
      let quiz = parseQuiz(generateID, mdText);
      quiz._rawMD = mdText;
      return saveNewQuiz(userID, quiz);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey });
      mutationConfig?.onSuccess?.(...args);
    },
  });
}

type UseSaveQuizOptions = {
  quizID: string | null;
  quizRef: DocumentReference | null;
  mutationConfig?: Omit<
    // Don't show mutationFn as an option
    UseMutationOptions<void, Error, string>,
    "mutationFn"
  >;
};

export function useSaveQuiz({
  quizID,
  quizRef,
  mutationConfig,
}: UseSaveQuizOptions) {
  const queryClient = useQueryClient();
  const queryKey = ["quizzes", quizID];
  return useMutation({
    ...mutationConfig,
    mutationFn: async (mdText: string) => {
      if (!quizID || !quizRef) return;
      let quiz = parseQuiz(generateID, mdText);
      quiz._rawMD = mdText;
      return updateQuiz(quizRef, quiz);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey });
      mutationConfig?.onSuccess?.(...args);
    },
  });
}

type UseDeleteQuizMutationConfig = Omit<
  // Don't show mutationFn as an option
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export function useDeleteQuiz(mutationConfig?: UseDeleteQuizMutationConfig) {
  const queryClient = useQueryClient();
  const queryKey = ["quizzes"];
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteQuizByID,
    // mutationFn: () => Promise.resolve(),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey });
      mutationConfig?.onSuccess?.(...args);
    },
  });
}
