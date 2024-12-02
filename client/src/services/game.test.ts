/**
 * @vitest-environment node
 */

import { db } from "@/services/firebase";
import { closeQuestion, startGame, startNewQuestion } from "@/services/game";
import { GameStatus } from "@/types/game";
import { doc, updateDoc } from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    doc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

describe("startGame", () => {
  const gameID = "testGameID";
  const gameRef = { id: gameID };
  const activeGameChannelRef = { id: gameID };
  const gameStatus = GameStatus.ONGOING;

  beforeEach(async () => {
    vi.clearAllMocks();
    (doc as Mock).mockImplementationOnce(() => gameRef);
    (doc as Mock).mockImplementationOnce(() => activeGameChannelRef);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it(`should update game and active game channel to "ongoing"`, async () => {
    (updateDoc as Mock).mockResolvedValueOnce(undefined);
    (updateDoc as Mock).mockResolvedValueOnce(undefined);

    await startGame(gameID);

    expect(doc).toHaveBeenCalledWith(db, "games", gameID);
    expect(doc).toHaveBeenCalledWith(db, "activeGamesChannel", gameID);
    expect(updateDoc).toHaveBeenCalledWith(gameRef, { status: gameStatus });
    expect(updateDoc).toHaveBeenCalledWith(activeGameChannelRef, {
      status: gameStatus,
    });
  });

  it("should throw if updateDoc fails", async () => {
    (updateDoc as Mock).mockRejectedValueOnce(new Error("Update failed"));

    try {
      await startGame(gameID);
    } catch (error) {
      expect(error).toEqual(new Error("Update failed"));
    }
  });
});

describe("startNewQuestion", () => {
  const gameID = "testGameID";
  const currentQuestionIndex = 1;
  const activeGameChannelRef = { id: gameID };

  beforeEach(async () => {
    vi.clearAllMocks();
    (doc as Mock).mockImplementationOnce(() => activeGameChannelRef);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it("should update active game channel with the current question index and reset currentQuestionAnswer", async () => {
    (updateDoc as Mock).mockResolvedValueOnce(undefined);

    await startNewQuestion(gameID, currentQuestionIndex);

    expect(doc).toHaveBeenCalledWith(db, "activeGamesChannel", gameID);
    expect(updateDoc).toHaveBeenCalledWith(activeGameChannelRef, {
      currentQuestionIndex,
      currentQuestionAnswer: null,
    });
  });

  it("should throw if updateDoc fails", async () => {
    (updateDoc as Mock).mockRejectedValueOnce(new Error("Update failed"));

    try {
      await startNewQuestion(gameID, currentQuestionIndex);
    } catch (error) {
      expect(error).toEqual(new Error("Update failed"));
    }
  });
});

describe("closeQuestion", () => {
  const gameID = "testGameID";
  const activeGameChannelRef = { id: gameID };
  const currentQuestionAnswer = ["Answer1", "Answer2"];

  beforeEach(async () => {
    vi.clearAllMocks();
    (doc as Mock).mockImplementation(() => activeGameChannelRef);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it("should update the active game channel with the current question answers", async () => {
    (updateDoc as Mock).mockResolvedValueOnce(undefined);

    await closeQuestion(gameID, currentQuestionAnswer);

    expect(doc).toHaveBeenCalledWith(db, "activeGamesChannel", gameID);
    expect(updateDoc).toHaveBeenCalledWith(activeGameChannelRef, {
      currentQuestionAnswer,
    });
  });

  it("should throw if updateDoc fails", async () => {
    (updateDoc as Mock).mockRejectedValueOnce(new Error("Update failed"));

    try {
      await closeQuestion(gameID, currentQuestionAnswer);
      throw new Error("closeQuestion did not throw as expected");
    } catch (error) {
      expect(error).toEqual(new Error("Update failed"));
    }
  });
});
