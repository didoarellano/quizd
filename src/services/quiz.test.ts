/**
 * @vitest-environment node
 */

import { db } from "@/services/firebase";
import {
  deleteQuizByID,
  generateID,
  getQuiz,
  getQuizzes,
  saveNewQuiz,
  updateQuiz,
} from "@/services/quiz";
import { NotAllowedError, QuizNotFoundError } from "@/utils/errors";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    addDoc: vi.fn(),
    collection: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(),
    updateDoc: vi.fn(),
    where: vi.fn(),
  };
});

describe("getQuiz", () => {
  const quizID = "testQuizID";
  const teacherID = "testTeacherID";
  const mockQuiz = {
    id: quizID,
    title: "Sample Quiz",
    description: "A test quiz",
    teacherID,
    _rawMD: "",
    questions: [],
    createdAt: {} as any, // Mocked FieldValue
  };

  const mockDocSnap = {
    exists: () => true,
    data: () => mockQuiz,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (doc as Mock).mockReturnValue({});
  });

  it("should return the quiz snapshot and data", async () => {
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getQuiz(quizID, teacherID);

    expect(doc).toHaveBeenCalledWith(db, "quizzes", quizID);
    expect(getDoc).toHaveBeenCalledWith({});
    expect(result).toEqual({
      docSnap: mockDocSnap,
      quiz: mockQuiz,
    });
  });

  it("should throw QuizNotFoundError if the quiz doesn't exist", async () => {
    const mockNonExistentDocSnap = {
      exists: () => false,
      data: () => {},
    };

    (getDoc as Mock).mockResolvedValue(mockNonExistentDocSnap);

    await expect(getQuiz(quizID, teacherID)).rejects.toThrow(QuizNotFoundError);
    expect(doc).toHaveBeenCalledWith(db, "quizzes", quizID);
    expect(getDoc).toHaveBeenCalledWith({});
  });

  it("should throw NotAllowedError if teacherID doesn't match", async () => {
    const mockMismatchedQuiz = {
      ...mockQuiz,
      teacherID: "wrongID",
    };

    const mockMismatchedDocSnap = {
      exists: () => true,
      data: () => mockMismatchedQuiz,
    };

    (getDoc as Mock).mockResolvedValue(mockMismatchedDocSnap);

    await expect(getQuiz(quizID, teacherID)).rejects.toThrow(NotAllowedError);
    expect(doc).toHaveBeenCalledWith(db, "quizzes", quizID);
    expect(getDoc).toHaveBeenCalledWith({});
  });
});

describe("getQuizzes", () => {
  const mockTeacherID = "teacher123";
  const mockQuizzes = [
    {
      id: "quiz1",
      title: "Quiz 1",
      teacherID: mockTeacherID,
      createdAt: "2024-01-01",
    },
    {
      id: "quiz2",
      title: "Quiz 2",
      teacherID: mockTeacherID,
      createdAt: "2024-01-02",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch quizzes in descending order", async () => {
    const mockQuerySnapshot = {
      docs: mockQuizzes.map((quiz) => ({
        id: quiz.id,
        data: () => quiz,
      })),
    };

    (collection as Mock).mockReturnValue("mockCollectionRef");
    (query as Mock).mockReturnValue("mockQuery");
    (orderBy as Mock).mockReturnValue("mockOrderBy");
    (where as Mock).mockReturnValue("mockWhere");
    (getDocs as Mock).mockResolvedValue(mockQuerySnapshot);

    const quizzes = await getQuizzes(mockTeacherID);

    expect(collection).toHaveBeenCalledWith(db, "quizzes");
    expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(where).toHaveBeenCalledWith("teacherID", "==", mockTeacherID);
    expect(query).toHaveBeenCalledWith(
      "mockCollectionRef",
      "mockOrderBy",
      "mockWhere"
    );
    expect(getDocs).toHaveBeenCalledWith("mockQuery");
    expect(quizzes).toEqual(mockQuizzes);
  });

  it("should fetch quizzes in ascending order when specified", async () => {
    const mockQuerySnapshot = {
      docs: mockQuizzes.map((quiz) => ({
        id: quiz.id,
        data: () => quiz,
      })),
    };

    (collection as Mock).mockReturnValue("mockCollectionRef");
    (query as Mock).mockReturnValue("mockQuery");
    (orderBy as Mock).mockReturnValue("mockOrderBy");
    (where as Mock).mockReturnValue("mockWhere");
    (getDocs as Mock).mockResolvedValue(mockQuerySnapshot);

    const quizzes = await getQuizzes(mockTeacherID, "asc");

    expect(orderBy).toHaveBeenCalledWith("createdAt", "asc");
    expect(quizzes).toEqual(mockQuizzes);
  });

  it("should return an empty array if no quizzes are found", async () => {
    const mockQuerySnapshot = { docs: [] };

    (collection as Mock).mockReturnValue("mockCollectionRef");
    (query as Mock).mockReturnValue("mockQuery");
    (orderBy as Mock).mockReturnValue("mockOrderBy");
    (where as Mock).mockReturnValue("mockWhere");
    (getDocs as Mock).mockResolvedValue(mockQuerySnapshot);

    const quizzes = await getQuizzes(mockTeacherID);
    expect(quizzes).toEqual([]);
  });
});

describe("saveNewQuiz", () => {
  const mockTeacherID = "teacher123";
  const mockQuiz = {
    title: "Test Quiz",
    description: "A test quiz description",
  };
  const mockQuizRef = { id: "mockQuizID" };

  beforeEach(() => {
    vi.clearAllMocks();
    (serverTimestamp as Mock).mockReturnValue("mockTimestamp");
    (collection as Mock).mockReturnValue("mockCollectionRef");
    (addDoc as Mock).mockResolvedValue(mockQuizRef);
  });

  it("should add a new quiz with the correct data", async () => {
    const result = await saveNewQuiz(mockTeacherID, mockQuiz);

    expect(collection).toHaveBeenCalledWith(db, "quizzes");
    expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
      ...mockQuiz,
      teacherID: mockTeacherID,
      createdAt: "mockTimestamp",
    });
    expect(result).toBe(mockQuizRef);
  });

  it("should throw an error if adding the document fails", async () => {
    (addDoc as Mock).mockRejectedValueOnce(new Error("Firestore Error"));

    await expect(saveNewQuiz(mockTeacherID, mockQuiz)).rejects.toThrow(
      "Firestore Error"
    );

    expect(addDoc).toHaveBeenCalledTimes(1);
  });
});

describe("updateQuiz", () => {
  const mockQuizRef = { id: "mockQuizRef" } as any; // Mock DocumentReference
  const mockQuizData = { title: "Updated Quiz" };

  beforeEach(() => {
    vi.clearAllMocks();
    (updateDoc as Mock).mockResolvedValue(undefined);
  });

  it("should update the quiz document with the correct data", async () => {
    await updateQuiz(mockQuizRef, mockQuizData);

    expect(updateDoc).toHaveBeenCalledWith(mockQuizRef, mockQuizData);
  });

  it("should throw an error if updateDoc fails", async () => {
    (updateDoc as Mock).mockRejectedValueOnce(new Error("Update failed"));

    await expect(updateQuiz(mockQuizRef, mockQuizData)).rejects.toThrow(
      "Update failed"
    );
  });
});

describe("deleteQuizByID", () => {
  const mockQuizID = "mockQuizID";
  const mockQuizRef = { id: mockQuizID };

  beforeEach(() => {
    vi.clearAllMocks();
    (doc as Mock).mockReturnValue(mockQuizRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);
  });

  it("should delete the quiz document by ID", async () => {
    await deleteQuizByID(mockQuizID);

    expect(doc).toHaveBeenCalledWith(expect.anything(), "quizzes", mockQuizID);
    expect(deleteDoc).toHaveBeenCalledWith(mockQuizRef);
  });

  it("should throw an error if deleteDoc fails", async () => {
    (deleteDoc as Mock).mockRejectedValueOnce(new Error("Delete failed"));

    await expect(deleteQuizByID(mockQuizID)).rejects.toThrow("Delete failed");
  });
});

describe("generateID", () => {
  const mockID = "mockGeneratedID";

  beforeEach(() => {
    vi.clearAllMocks();
    (doc as Mock).mockReturnValue({ id: mockID });
    (collection as Mock).mockReturnValue("mockCollection");
  });

  it("should generate a new ID", () => {
    const result = generateID();

    expect(collection).toHaveBeenCalledWith(expect.anything(), "dummy");
    expect(doc).toHaveBeenCalledWith("mockCollection");
    expect(result).toBe(mockID);
  });
});
