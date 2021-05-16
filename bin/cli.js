#! /usr/bin/env node

// 1. 配置可执行命令
// 2. 命令行交互
// 3. 模版下载
// 4. 根据用户选择动态生产内容

const program = require('commander');
const chalk  = require('chalk');
const figlet = require('figlet');

// 核心功能 1.创建项目 2.更改配置文件 3.UI界面 @vue/ui

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist') // 是否强制创建，当文件夹已经存在
  .action((name, options) => {
    require('../lib/create.js')(name, options)
  })

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program
  .on('--help', () => {
    console.log()
    console.log(figlet.textSync('zhurong', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    console.log()
    console.log(`Run ${chalk.cyan(`roc <command> --help`)} show details`)
    console.log()
  })

// 解析用户执行命令传入参数
program.parse(process.argv);