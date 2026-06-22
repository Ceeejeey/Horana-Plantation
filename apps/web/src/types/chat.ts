export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface TopicItem {
  title: string;
  desc: string;
  prompt: string;
}

export interface TopicCategory {
  category: string;
  iconType: string;
  items: TopicItem[];
}

export interface ChartDataItem {
  name: string;
  value: number;
}
