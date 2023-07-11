var tl = require('azure-pipelines-task-lib/task');
import * as request from 'request';

async function run() {
    try {
        const language: string | undefined = tl.getInput('Language', true);
        const version: string | undefined = tl.getInput('Version', true);
        switch (language) {
            case "Dotnet":
                console.log("The color is red.");
                break;
            case "Node":
                console.log("The color is blue.");
                break;
            case "Angular":
                console.log("The color is green.");
                break;
            case "Terraform":
                console.log("The color is green.");
                break;
            default:
                console.log("Unknown color.");
                break;
            }
        const result = await getLatestDotnetVersion(version)
        if (!result) {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        } else {
            tl.setResult(tl.TaskResult.Succeeded, 'The version is up to date')
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}



function getLatestDotnetVersion(currentVersion: string): Promise<boolean> {
  let upToDate = false;
  // Declare local variables
  const url = "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json";
  const releaseList: { [key: string]: string }[] = [{}];
  // Extract the two-digit major version (ex. 3.1, 6.0, 8.0, etc.)
  const parsedVersion = currentVersion.split(".");
  const appMajorVersion = parsedVersion[0] + "." + parsedVersion[1];
  
  return new Promise<boolean>((resolve, reject) => {
    // Execute HTTP GET request to pull all available versions
    request(url, (error, response, body) => {
      if (error) {
        console.error("Error:", error);
        reject(error);
        return;
      }
      
      const data = JSON.parse(body);
      // Parse the existing release list
      const releasesIndex = data["releases-index"];
      // Record all existing versions and their URLs
      for (const release of releasesIndex) {
        releaseList[0][release["channel-version"]] = release["releases.json"];
      }
      
      // Pull the release specific information for the version in question
      request(releaseList[0][appMajorVersion], (error, response, body) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
          return;
        }
  
        const minorVersionData = JSON.parse(body);
        const latestMinorVersion = minorVersionData["latest-release"];
  
        // Check if the version has reached EOL
        if (minorVersionData["support-phase"] === "eol") {
          console.log("End of Life");
        } else {
          console.log("Major version in LTS");
        }
  
        if (parseInt(parsedVersion[2]) <= parseInt(latestMinorVersion.split(".")[2])) {
          console.log(`The minor version is outdated and should be updated. The latest version is ${latestMinorVersion} and this app is currently running ${currentVersion}`);
        } else {
          console.log("The minor version is up to date");
          upToDate = true;
        }
  
        resolve(upToDate);
      });
    });
  });
}


run();