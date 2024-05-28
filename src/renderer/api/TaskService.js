import Api from '@/services/Api'

export default {
  getTasks(user) {
    let json = JSON.stringify(user)
    return Api.post('tasks', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  createTask(task) {
    let json = JSON.stringify(task)
    return Api.post('create-task', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  deleteTask(taskId) {
    return Api.delete('delete-task/' + taskId)
  },
  checkApiRunning() {
    return Api.get('health')
  },
  getApiVersion() {
    return Api.get('version')
  }
}
