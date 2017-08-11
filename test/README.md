## Developer Notes

#### Mocha/Chai unit spec tips

1. Try to follow the following pattern for methods returning promises:
The expect statement must be explicitly returned.

[MochaJS Documentation](https://mochajs.org/#getting-started)
[Chai Documentation](http://chaijs.com/guide/styles/)
[Chai-as-promised Git repo](https://github.com/domenic/chai-as-promised)

```javascript
describe("#myFunction", function(){
  it("has some property", function(){
    return expect(module.myFunction()).to.eventually.have.some.property;
  });
});
```

2. Unless the spec is for throwing an error, in that case, try the following
```javascript
  it("throws an error when condition", function(){
    return expect(module.myfunction()).to.be.rejectedWith(ErrorType, /err message/);
  });
```
3. Use the `instanceof` helper instead of `...eventually.be.an(Object)`
