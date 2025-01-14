import {
  BranchesOutlined,
  DatabaseOutlined,
  MergeCellsOutlined,
  MessageOutlined,
  QuestionOutlined,
  RocketOutlined,
  SendOutlined,
  SlidersOutlined,
} from '@ant-design/icons';

export enum Operator {
  Begin = 'Begin',
  Retrieval = 'Retrieval',
  Generate = 'Generate',
  Answer = 'Answer',
  Categorize = 'Categorize',
  Message = 'Message',
  Relevant = 'Relevant',
  RewriteQuestion = 'RewriteQuestion',
}

export const operatorIconMap = {
  [Operator.Retrieval]: RocketOutlined,
  [Operator.Generate]: MergeCellsOutlined,
  [Operator.Answer]: SendOutlined,
  [Operator.Begin]: SlidersOutlined,
  [Operator.Categorize]: DatabaseOutlined,
  [Operator.Message]: MessageOutlined,
  [Operator.Relevant]: BranchesOutlined,
  [Operator.RewriteQuestion]: QuestionOutlined,
};

export const operatorMap = {
  [Operator.Retrieval]: {
    description: 'Retrieval description drjlftglrthjftl',
    backgroundColor: '#cad6e0',
    color: '#385974',
  },
  [Operator.Generate]: {
    description: 'Generate description',
    backgroundColor: '#ebd6d6',
    width: 150,
    height: 150,
    fontSize: 20,
    iconFontSize: 30,
    color: '#996464',
  },
  [Operator.Answer]: {
    description: 'Answer description',
    backgroundColor: '#f4816d',
    color: 'white',
  },
  [Operator.Begin]: {
    description: 'Begin description',
    backgroundColor: '#4f51d6',
  },
  [Operator.Categorize]: {
    description: 'Categorize description',
    backgroundColor: '#ffebcd',
    color: '#cc8a26',
  },
  [Operator.Message]: {
    description: 'Message description',
    backgroundColor: '#c5ddc7',
    color: 'green',
  },
  [Operator.Relevant]: {
    description: 'BranchesOutlined description',
    backgroundColor: '#9fd94d',
    color: 'white',
    width: 70,
    height: 70,
    fontSize: 12,
    iconFontSize: 16,
  },
  [Operator.RewriteQuestion]: {
    description: 'RewriteQuestion description',
    backgroundColor: 'white',
  },
};

export const componentMenuList = [
  {
    name: Operator.Retrieval,
    description: operatorMap[Operator.Retrieval].description,
  },
  {
    name: Operator.Generate,
    description: operatorMap[Operator.Generate].description,
  },
  {
    name: Operator.Answer,
    description: operatorMap[Operator.Answer].description,
  },
  {
    name: Operator.Categorize,
    description: operatorMap[Operator.Categorize].description,
  },
  {
    name: Operator.Message,
    description: operatorMap[Operator.Message].description,
  },
  {
    name: Operator.Relevant,
    description: operatorMap[Operator.Relevant].description,
  },
  {
    name: Operator.RewriteQuestion,
    description: operatorMap[Operator.RewriteQuestion].description,
  },
];

export const initialRetrievalValues = {
  similarity_threshold: 0.2,
  keywords_similarity_weight: 0.3,
  top_n: 8,
};

export const initialBeginValues = {
  prologue: `Hi! I'm your assistant, what can I do for you?`,
};

export const initialGenerateValues = {
  // parameters: ModelVariableType.Precise,
  // temperatureEnabled: true,
  temperature: 0.1,
  top_p: 0.3,
  frequency_penalty: 0.7,
  presence_penalty: 0.4,
  max_tokens: 512,
  prompt: `Please summarize the following paragraphs. Be careful with the numbers, do not make things up. Paragraphs as following:
  {cluster_content}
The above is the content you need to summarize.`,
  cite: true,
};

export const initialFormValuesMap = {
  [Operator.Begin]: initialBeginValues,
  [Operator.Retrieval]: initialRetrievalValues,
  [Operator.Generate]: initialGenerateValues,
  [Operator.Answer]: {},
  [Operator.Categorize]: {},
  [Operator.Relevant]: {},
};

export const CategorizeAnchorPointPositions = [
  { top: 1, right: 34 },
  { top: 8, right: 18 },
  { top: 15, right: 10 },
  { top: 24, right: 4 },
  { top: 31, right: 1 },
  { top: 38, right: -2 },
  { top: 62, right: -2 }, //bottom
  { top: 71, right: 1 },
  { top: 79, right: 6 },
  { top: 86, right: 12 },
  { top: 91, right: 20 },
  { top: 98, right: 34 },
];

// key is the source of the edge, value is the target of the edge
// no connection lines are allowed between key and value
export const RestrictedUpstreamMap = {
  [Operator.Begin]: [],
  [Operator.Categorize]: [Operator.Begin, Operator.Categorize, Operator.Answer],
  [Operator.Answer]: [],
  [Operator.Retrieval]: [],
  [Operator.Generate]: [],
  [Operator.Message]: [],
  [Operator.Relevant]: [],
  [Operator.RewriteQuestion]: [],
};

export const NodeMap = {
  [Operator.Begin]: 'beginNode',
  [Operator.Categorize]: 'categorizeNode',
  [Operator.Retrieval]: 'ragNode',
  [Operator.Generate]: 'ragNode',
  [Operator.Answer]: 'ragNode',
  [Operator.Message]: 'ragNode',
  [Operator.Relevant]: 'relevantNode',
  [Operator.RewriteQuestion]: 'ragNode',
};
