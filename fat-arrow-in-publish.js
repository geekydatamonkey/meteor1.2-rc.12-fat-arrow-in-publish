/**
* create 2 collections
* we'll do the same operations to both
* but the ES5 collection will use an es5 style
* function() within the publish method.
* the ES2015 collection will use a () => {}
* style function within the publish method
*/
TasksES5 = new Mongo.Collection('tasks');
TasksES2015 = new Mongo.Collection('tasks_es2015');

if (Meteor.isClient) {
  Meteor.subscribe('tasks_es5');
  Meteor.subscribe('tasks_es2015');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

  Template.body.helpers({
    tasksES5() {
      return TasksES5.find({});
    },
    tasksES2015() {
      return TasksES2015.find({});
    },
  });

  Meteor.startup(() => {
    Meteor.loginWithPassword('test', 'test');
  });
}

/**
* Server
*/
if (Meteor.isServer) {
  /**
  * the only difference between these functions
  * is whether fat-arrow function binding is used
  * tasks_es2015 doesn't properly publish
  */
  Meteor.publish('tasks_es5', function() {
    return TasksES5.find({ owner: this.userId });
  });

  Meteor.publish('tasks_es2015', () => {
    return TasksES2015.find({ owner: this.userId });
  });

  /**
  * create some test data on startup
  */
  Meteor.startup(() => {
    // drop old dummy data
    Meteor.users.remove({});
    TasksES5.remove({});
    TasksES2015.remove({});

    // create a user
    const userId = Accounts.createUser({
      username: 'test',
      password: 'test',
    });

    // create 10 tasks in both collections
    // each owned by userId
    _.range(1, 11).forEach((i) => {
      const task = {
        text: `Task #${i}`,
        owner: userId,
      };

      TasksES5.insert(task);
      TasksES2015.insert(task);
    });
  });
}
