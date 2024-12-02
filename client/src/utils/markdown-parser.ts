import { Answer, Option, Question, Quiz } from "@/types/quiz";
import type { Parent, Root, RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { gfmFromMarkdown, gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";
import { frontmatter } from "micromark-extension-frontmatter";
import { gfm } from "micromark-extension-gfm";
import yaml from "yaml";

type idGenerator = () => string;

const toMDAST = (mdText: string): Root =>
  fromMarkdown(mdText, {
    extensions: [frontmatter(["yaml"]), gfm()],
    mdastExtensions: [frontmatterFromMarkdown(["yaml"]), gfmFromMarkdown()],
  });

const toMD = (nodes: RootContent[]) =>
  toMarkdown(
    { type: "root", children: nodes },
    { extensions: [gfmToMarkdown()] }
  );

function parseOptions(
  optionNodes: any[],
  generateID: idGenerator
): { options: Option[]; answers: Answer[] } {
  let answers: Answer[] = [];
  const options: Option[] = optionNodes
    .filter((o) => o.type === "listItem")
    .map((optionNode) => {
      const optionID = generateID();
      const text = toMD(optionNode.children);

      if (optionNode.checked) {
        answers.push(optionID);
      }

      return { id: optionID, text };
    });

  return { options, answers };
}

function parseQuestion(
  node: Parent,
  i: number,
  tree: Root,
  generateID: idGenerator
): Question {
  const questionID = generateID();
  const heading = toMD(node.children);

  let j = i + 1;
  let nextNode: RootContent;
  let bodyContent: RootContent[] = [];
  while ((nextNode = tree.children[j])) {
    if (nextNode?.type === "list") break;
    bodyContent.push(nextNode);
    j++;
  }

  const body = toMD(bodyContent);

  let options: Option[] = [];
  let answers: Answer[] = [];
  if (nextNode.type === "list") {
    ({ options, answers } = parseOptions(nextNode.children, generateID));
  }

  return {
    id: questionID,
    heading,
    body,
    options,
    answers,
  };
}

export function parseQuiz(generateID: idGenerator, mdText: string): Quiz {
  const tree = toMDAST(mdText);
  return tree.children.reduce((quiz, node, i) => {
    // YAML frontmatter
    if (i === 0 && node.type === "yaml") {
      Object.assign(quiz, yaml.parse(node.value));
    }

    // Questions
    if (node.type === "heading" && node.depth === 2) {
      let question = parseQuestion(node, i, tree, generateID);
      quiz.questions = quiz.questions ?? [];
      quiz.questions.push(question);
    }

    return quiz;
  }, {} as Quiz);
}
