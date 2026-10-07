import { profile } from "./saonumi";
type Social = { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "facebook" | "x" };
export const social: Social[] = [
  { url: "https://www.facebook.com/Saonumi31/", name: "facebook" },
  { url: "https://www.instagram.com/saonumi/", name: "instagram" },
  { url: "https://www.linkedin.com/in/saonumi", name: "linkedin" },
  { url: profile.github, name: "github" },
  { url: "mailto:" + profile.email, name: "mail" },
];
