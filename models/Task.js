"use strict";
class Task {
  constructor(task, owner, unique_key, isDone = false) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
    this.unique_key = unique_key;
  }

  //static array contains all tasks of all users of the program
  static arrTasks;

  //static initialization of arrTasks
  static {
    this.arrTasks = JSON.parse(getFromStorage(KEY_TASK_ARRAY)) || [];
  }

  static getOwnerTask(username) {
    return this.arrTasks
      .filter((t) => {
        let taskT = JSON.parse(t);
        return taskT.owner == username;
      })
      .map((sTask) => {
        let jTask = JSON.parse(sTask);
        return new Task(
          jTask.task,
          jTask.owner,
          jTask.unique_key,
          jTask.isDone
        );
      });
  }

  static deleteByUniqueKey(unique_key) {
    let count = 0;
    this.arrTasks = this.arrTasks.filter((t) => {
      let taskT = JSON.parse(t);
      if (taskT.unique_key === unique_key) {
        count++;
        return false; //remove
      }
      return true; //keep
    });
    if (count > 0) saveToStorage(KEY_TASK_ARRAY, JSON.stringify(this.arrTasks));
    return count;
  }

  static toggleTaskStatusByUniqueKey(unique_key) {
    let count = 0;
    this.arrTasks = this.arrTasks.map((t) => {
      try {
        let taskT = JSON.parse(t);
        if (taskT.unique_key === unique_key) {
          taskT.isDone = !taskT.isDone;
          count++;
        }
        return JSON.stringify(taskT);
      } catch (e) {
        return t;
      }
    });
    saveToStorage(KEY_TASK_ARRAY, JSON.stringify(this.arrTasks));
    return count;
  }

  static saveAllDownToStorage() {
    saveToStorage(KEY_TASK_ARRAY, JSON.stringify(this.arrTasks));
  }

  save() {
    Task.arrTasks.push(JSON.stringify(this));
    Task.saveAllDownToStorage();
  }
}
