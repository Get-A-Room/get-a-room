# Get A Room!

## Project structure

The project is divided into frontend and backend folders which contain the corresponding npm projects and README.md:s. Remember to also check those README.md:s for development environment instructions etc.

## Code formatting

To utilize code formatting on commit, run `npm install` in the project root folder

## Setting up a new Google Cloud Environment and deployment

Here are instructions on setting up a new Google Cloud deployment environment i.e. if new staging or production environment is needed.

First a new project should be created to Google Cloud. Name for the project could be for example "get-a-room".

Next up "Container registry" and "Cloud Build API" should be enabled for this newly created project. These are used to storage and build the Cloud Run containers.
Also remember to enable the Google Calendar API and Admin SDK API for the project from these URL:s:

https://console.cloud.google.com/marketplace/product/google/calendar-json.googleapis.com
https://console.cloud.google.com/marketplace/product/google/admin.googleapis.com

Next up if you are using GitHub actions to deploy the project to this new environment, a new service account should be created for the newly created Google Cloud project. Service account is used to authenticate the GitHub actions, so automatic deployments are possible. Service account name could be for example "get-a-room" and the service account should be given these roles:

Cloud Run Admin
Cloud Build Editor
Cloud Build Service Account
Viewer
Service Account User

At this newly created service accounts page, go to "KEYS" -> "ADD KEY" -> "Create new key" -> "JSON" -> "Create". After downloading the key, its whole content should be saved as GitHub repository secret, so it can be accessed inside the GitHub actions worklow file .github/workflows/ci.yml and GitHub Actions have permission to use Google Cloud Build API and Cloud Runs. Secret name could be something like this: "GCR_SA_KEY_NEW_ENVIRONMENT_NAME".

After adding the service account key, next up the Google Clouds project ID should also be added as GitHub repository secret. Project ID probably looks something like this: "get-a-room-123456" and can be checked from Google Cloud. Naming convention on the ci.yml file for the project ID secrets is something like this: "GCR_PROJECT_NEW_ENVIRONMENT_NAME"

Now best way to find out where and how these env variables should be used inside the ci.yml file is to check how the existing variables are used. Existing Google project ID variables and service account keys are named something like this: "GCR_PROJECT*" and "GCR_SA_KEY*"

Now after these variables are setted up, a new deployment job should be created that uses these new variables. Deployment jobs reside inside file .github/workflows/ci.yml. You can check how the existing deployment jobs are created there (i.e. frontend-deploy-prod and backend-deploy-prod) and copy them and use these newly created GitHub secrets on them.

After new deployment jobs are created, you can run the pipeline. The pipeline builds the images and deploys them to the Cloud Runs. First time backend deploy to Cloud Run probably fails with errors that ENV variables are not set. ENV variables can be setted up at the backends Cloud Run page. Example on what ENV variables should be setted up to the backend Cloud Run can be found in file backend/.env.example In file backend/.env.example there is helpful comments on how to obtain these ENV variables.

Also new nginx.conf should be created for this new environment, you can check how the existing nginx.confs are created (i.e. frontend/.docker/.docker-prod/nginx.conf) Remember to change the "proxy_pass" address from this nginx.conf to point to this newly created environments Cloud Run backend. So the Nginx knows to route the /api paths traffic to the correct backend. Backends auto generated URL can be found at the Cloud Runs edit/information page.

After this you probably want to point some domain to this application. This can done by pointing the domain to the frontend/Nginx Cloud Run service. After the domain is pointed correctly, it should setted up also to the FRONTEND_URL and CALLBACK_URL ENV variables.

As a last thing, new OAuth 2.0 Client should be created in Google Cloud -> "APIs and services" -> "CREATE CREDENTIALS" -> "OAuth Client ID". Application type is "Web Application". Authorized JavaScript origins can be left empty. And to the "Authorised redirect URIs" this URL should be added: "https://yourdomainname.com/api/auth/google/callback" And of course remember to replace "yourdomainname" with the new domain name that was reserved for this application.

Now you should have a working GitHub actions deployment and a new environment!
