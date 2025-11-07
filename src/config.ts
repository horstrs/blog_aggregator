import os from "os";
import fs from "fs";
import path from "path";

type Config = {
  dbUrl: string,
  currentUserName: string,
}
const CONFIG_FILE_NAME = ".gatorconfig.json";

export function setUser(currentUserName: string) {
  const newConfig = readConfig();
  newConfig.currentUserName = currentUserName;
  writeConfig(newConfig);
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return validateConfigFile(content);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), CONFIG_FILE_NAME);
}

function validateConfigFile(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
    throw new Error("current_user_name is required in config file");
  }
  const validConfig: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name
  }
  return validConfig;
}

function writeConfig(configFile: Config) {
  const filePath = getConfigFilePath();
  const rawConfig = {
    db_url: configFile.dbUrl,
    current_user_name: configFile.currentUserName,
  };
  const configString = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(filePath, configString, { encoding: "utf-8" });
}