'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the generator-imatviyenko-dws generator!'));

    const checkNonEmpty = value => {
      if (!value) {
        return 'The value cannot be empty!';
      }
      return true;
    };

    const checkPositiveInteger = (value, min, max) => {
      let nValue = Number(value);
      if (Number.isInteger(nValue) && nValue >= 0) {
        let flag = true;
        if (flag && min && min > nValue) flag = false;
        if (flag && max && max < nValue) flag = false;
        if (flag) return true;
      }
      return (
        'The value must be a positive integer in the range ' + min + '-' + max + ' !'
      );
    };

    const commonPrompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'dockerRegistryPath',
        message: 'Docker registry path (e.q. docker.company.com:5000)',
        validate: checkNonEmpty
      },
      {
        type: 'input',
        name: 'tcpPort',
        message:
          'Publically accessible TCP port on the Docker Swarm (valid range 4010-4999)',
        validate: value => checkPositiveInteger(value, 4010, 4999)
      },
      {
        type: 'input',
        name: 'timeZone',
        message:
          'Timezone as is specified in the tz database https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
        default: 'Etc/GMT'
      },
      {
        type: 'input',
        name: 'instanceCount',
        message: 'Count of Docker instances to start (valid range 1-10)',
        validate: value => checkPositiveInteger(value, 1, 10)
      },
      {
        type: 'confirm',
        name: 'enableALA',
        message:
          'Would you like to enable the Azure Log Analytics integration via fluentd forwarders on Docker hosts?',
        default: true
      }
    ];

    return this.prompt(commonPrompts).then(commonProps => {
      // To access props later use this.props.someAnswer;
      this.props = {
        ...commonProps
      };
    });
  }

  writing() {
    // Check if the generator is running of a Windows machine
    let isWindows = process.platform === 'win32';
    this.props = {
      ...this.props,
      isWindows
    };

    const copyFile = fileName => {
      this.fs.copy(this.templatePath(fileName), this.destinationPath(fileName));
    };

    const copyTemplate = fileName => {
      this.fs.copyTpl(
        this.templatePath(fileName),
        this.destinationPath(fileName.replace('_', '')),
        this.props
      );
    };

    const createEmptyFolder = folderName => {
      mkdirp(this.destinationPath(folderName));
    };

    // Copy source files which does not require content modification
    copyFile('app.js');
    copyFile('index.js');
    copyFile('README.md');
    copyFile('.gitignore');
    copyFile('access-control');
    copyFile('api');
    copyFile('logging');
    copyFile('config/config.js');
    copyFile('config/dev-secrets');
    copyFile('config/dev-config.json');
    copyFile('config/prod-config.json');
    copyFile('scripts/docker/Dockerfile');
    copyFile('scripts/deploy.ps1'); // PowerShell script for Windows environment
    copyFile('scripts/deploy-secrets.ps1'); // PowerShell script for Windows environment
    copyFile('scripts/deploy-config.ps1'); // PowerShell script for Windows environment
    copyFile('scripts/deploy.sh'); // Shell script for Unix/Linux environment
    copyFile('scripts/deploy-secrets.sh'); // Shell script for Unix/Linux environment
    copyFile('scripts/deploy-config.sh'); // Shell script for Unix/Linux environment
    copyFile('scripts/bin/jq'); // Linux binary jq for quering JSON files

    // Create an empty directory in the destination folder for production mode Docker Swarm secrets
    createEmptyFolder('config/PROD-SECRETS-SENSITIVE');

    // Copy with template transformation
    copyTemplate('_package.json');
    copyTemplate('config/_appInfo.js');
    copyTemplate('scripts/_deploy.json');
    copyTemplate('scripts/docker/_docker-compose.yml');
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
