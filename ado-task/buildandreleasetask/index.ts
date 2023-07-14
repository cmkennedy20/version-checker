var tl = require('azure-pipelines-task-lib/task');
import request = require('request');
import fs from 'fs';

async function run() {
    try {
        const language: string | undefined = tl.getInput('Language', true);
        const fileHandler: string | undefined = tl.getPathInput('FileHandler', true);
        var result = new Boolean;
        if (language == undefined ) {
            tl.setResult(tl.TaskResult.Failed, 'No language was given');
            return;
        }
        if (fileHandler == undefined ) {
            tl.setResult(tl.TaskResult.Failed, 'No file was given');
            return;
        }
        switch (language) {
            case "Dotnet":
                result = await getLatestDotnetVersion(fileHandler)
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

                break;
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

function getDotnetVersion(string):Promise<string>{
  
}

function checkNugetPackage(): Promise<boolean>{
  
}

function readProjectFile(filename: string): void {
  // Read the file
  fs.readFile(filename, 'utf8', function (error: NodeJS.ErrnoException | null, fileContent: string) {
    if (error) {
      console.log('Error reading file:', error);
      return;
    }

    const pattern = /<PackageReference Include="([^"]+)" Version="([^"]+)" \/>/g;

    // Find all package references in the .csproj content
    const packageReferences: { packageName: string; packageVersion: string }[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(fileContent)) !== null) {
      const packageName = match[1];
      const packageVersion = match[2];
      packageReferences.push({ packageName, packageVersion });
    }

    // Log the extracted package and version information
    packageReferences.forEach((packageRef) => {
      console.log('Package:', packageRef.packageName);
      console.log('Version:', packageRef.packageVersion);
    });
  });
}



run();