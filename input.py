import requests
from requests.auth import HTTPBasicAuth

def get_latest_dotnet_version(current_version):
    up_to_date = False
    # Declare local variables
    url = "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json"
    release_list = [dict()]
    # Extract the two digit major version (ex. 3.1, 6.0, 8.0, etc.)
    parsed_version = current_version.split(".")
    app_major_version = parsed_version[0] + "." + parsed_version[1]
    # Execute HTTP GET request to pull all available versions
    response = requests.get(url)
    data = response.json()
    # Parse the existing release list
    releases_index = data["releases-index"]
    # Record all existing versions and their URL's 
    for release in releases_index:
        release_list[0][release["channel-version"]]=release["releases.json"]
    # Pull the release specific information for the version in question
    minor_version_response = requests.get(release_list[0]['{}'.format(app_major_version)])
    minor_version_data = minor_version_response.json()
    latest_minor_version = minor_version_data["latest-release"]
    # Check if the version has reach EOL
    if minor_version_data["support-phase"] == "eol":
        print("End of Life")
    else: 
        print("Major version in LTS")
    if parsed_version[2] <= latest_minor_version.split(".")[2]:
        print("The minor version is outdated and should be updated. The latest version is {} and this app is currently running {}".format(latest_minor_version,current_version))
    else: 
        print("The minor version is up to date")
        up_to_date = True
    return up_to_date
get_latest_dotnet_version("7.0.1")