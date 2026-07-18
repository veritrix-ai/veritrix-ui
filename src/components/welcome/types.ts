export type UsageType = "hobby" | "work" | "help";

export interface WelcomeFormData {
  usage: UsageType | null;
  companyName: string;
  companySize: string;
  buildingDescription: string;
  stage: string;
  heardFrom: string;
  frameworks: string[];
  providers: string[];
  helpGoals: string[];
}

export const initialWelcomeFormData: WelcomeFormData = {
  usage: null,
  companyName: "",
  companySize: "Just me",
  buildingDescription: "",
  stage: "Just playing around",
  heardFrom: "LinkedIn",
  frameworks: [],
  providers: [],
  helpGoals: [],
};
