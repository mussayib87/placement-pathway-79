import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCompanies from "./tools/list-companies";
import listExperiences from "./tools/list-experiences";
import getExperience from "./tools/get-experience";
import createExperience from "./tools/create-experience";
import listResources from "./tools/list-resources";
import createResource from "./tools/create-resource";

const projectRef =
  import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "placement-navigator",
  title: "Placement Navigator",
  version: "0.1.0",
  instructions:
    "Tools for the Placement Resource Hub. Browse and add interview experiences, companies and placement preparation resources on behalf of the signed-in student.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listCompanies,
    listExperiences,
    getExperience,
    createExperience,
    listResources,
    createResource,
  ] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
