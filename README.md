# meteor1.2-rc.12-fat-arrow-in-publish

This repo is a demo of an issue in meteor1.2-rc.12.

`this.userId` in `Meteor.publish()` doesn't work as expected when using ES2015 fat arrow functions `() => {...}`. 

For example,this code gives different results:

ES5 flavored:
```
Meteor.publish('tasks', function() {
  return Tasks.find({ owner: this.userId });
});
```


ES2015 flavored, with fat-arrow anonymous functions (and `this` binding):
```
Meteor.publish('tasks', () => {
  return Tasks.find({ owner: this.userId });
});
```