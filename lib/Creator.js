const {fetchRepoList, fetchTagList} = require('./request')
const inquirer = require('inquirer')
const ora = require('ora')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise
const util = require('util')
const path = require('path')
const chalk = require('chalk')

async function sleep (n) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, n);
  })
}

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result; 
  } catch (error) {
    spinner.fail('Request failed, refetch ...')
    await sleep(1000)
    return wrapLoading(fn, message, ...args)
  } 
}

class Creator {
  constructor (name, targetDir){
    this.name = name;
    this.targetDir = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async fetchRepo() {
    const repoList = await wrapLoading(fetchRepoList, 'waiting fetch template');
    if (!repoList) return;

    const repos = repoList.map(item => item.name);

    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    return repo;
  }

  async fetchTag(repo) {
    const tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo);
    if (!tags) return;
    
    const tagsList = tags.map(item => item.name);

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project'
    })

    return tag
  }

  async download(repo, tag){
    // 1. 需要拼接下载路径
    // 2. 下载的文件放在某个路径（后续增加缓存功能）

    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;

    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template', 
      requestUrl, 
      path.resolve(process.cwd(),
      this.targetDir,
    ))

    
  }

  async create() {
    // 1. 先拉取当前组织下的模板
    const repo = await this.fetchRepo()
    // 2. 通过模板找到版本号
    const tag = await this.fetchTag(repo)
    // 3. 下载
    await this.download(repo, tag)

    console.log()
    console.log(`Successfully created project ${chalk.cyan(this.name)}`)
    console.log()
    console.log(`  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev')
    console.log()
  }
}

module.exports = Creator;