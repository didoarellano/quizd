import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { QuizDeleteButton } from "../components/QuizDeleteButton";
import { useAuth } from "../contexts/AuthContext";
import { deleteQuizByID, getQuizzes } from "../services/quiz";

export function QuizList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    isPending,
    isError,
    error,
    data: quizzes,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => getQuizzes(user.id),
  });

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: (quizID: string) => deleteQuizByID(quizID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  if (isPending) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {quizzes.length < 1 ? (
        <>
          <p>You don't have any quizzes.</p>
          <Link href="/new">Create one!</Link>
        </>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id}>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <p>{quiz.questions?.length} questions</p>
            <Link href={`/${quiz.id}/host`}>Host Game</Link>
            <Link href={`/${quiz.id}`}>Edit Quiz</Link>
            <QuizDeleteButton onDeleteClick={() => deleteQuiz(quiz.id)} />
          </div>
        ))
      )}
    </div>
  );
}
