class MyClass {

  // 私有属性
  #privateParam
  constructor () {
    this.#privateParam = 1
  }

  // 私有方法
  #privateMethod() {
    console.log(this.#privateParam)
  }

  method() {
    // console.log(3)
    // this.#privateMethod();
    console.log(this.#privateParam);
  }
}

const c = new MyClass();
c.method()
console.log(c.privateParam);
c.privateMethod();