import Api from '@/api/Api'
const Store = require('electron-store')
const store = new Store()
// import config from '../config'
const license = store.get('license.data.attributes.metadata', {})

export default {
  createActivity(payload) {
    payload.user_email = license.userEmail
    payload.user_name = license.userName
    return Api.post('activity', payload)
  }
}
