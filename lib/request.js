// 通过 axios 获取结果
// 利用官方给的一些方法，解决 60 次限制问题
// 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

const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})



async function fetchRepoList() {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}


async function  fetchTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  fetchRepoList,
  fetchTagList
}