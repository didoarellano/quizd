export class QuizNotFoundError extends Error {
  name: string;
  statusCode: number;
  constructor(message = "Quiz not found") {
    super(message);
    this.name = "QuizNotFoundError";
    this.statusCode = 404;
  }
}

export class NotAllowedError extends Error {
  name: string;
  statusCode: number;
  constructor(message = "You are not allowed to perform this action") {
    super(message);
    this.name = "NotAllowedError";
    this.statusCode = 403;
  }
}
