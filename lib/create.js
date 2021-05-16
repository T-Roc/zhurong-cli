const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Creator = require('./Creator')

module.exports = async function (name, options) {
  // 创建项目

  const cwd  = process.cwd();
  const targetAir  = path.join(cwd, name)

  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // 提示用户是否确定要覆盖
      let {action} = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },{
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])

      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const creator = new Creator(name, targetAir);

  // 开始创建项目
  creator.create()
}