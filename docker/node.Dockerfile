FROM node:latest
WORKDIR /opt/ado-task/buildandreleasetask/
RUN cd /opt/ado-task/buildandreleasetask/ \
    && npm init -y \
    && npm install azure-pipelines-task-lib --save \
    && npm install @types/node --save-dev \
    && npm install @types/q --save-dev \
    && npm i -g tfx-cli \
    && npm install mocha --save-dev -g \
    && npm install sync-request --save-dev \
    && npm install @types/mocha --save-dev \
    && npm install typescript@4.6.3 -g --save-dev \ 
    && tsc --init --target es6
