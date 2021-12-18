import packageJson from "../../infrastructurerc.json";

export class Config {
  public org = packageJson.org;
  public cicdEnvironment = "cicd";
  public environments = ["test", "production", "dev"];
  public region = packageJson.region;
  public name = packageJson.name;
}
