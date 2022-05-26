// 正则表达式相关

// 测试
// const date = '2022-02-22'
// const reg = /^(\d{4})-(\d{2})-(\d{2})$/
// console.log(date.match(reg)); // 不加全局g的情况下输出数组，分别为匹配到的结果，每个分组匹配到的结果，下标，输入的文本
// date.match(reg);  // 上面输入后，还是要再执行一边，否则去不到$1的值
// console.log(RegExp.$1);
// console.log(RegExp.$2);
// console.log(RegExp.$3);

// 匹配颜色
const colorReg = /(^#[0-9a-zA-Z]{6}$|^#[0-9a-zA-Z]{3}$)/;
const color = "#ee1";
// console.log(colorReg.test(color));

// 匹配时间24:09:08类型
// const timeReg = /^([012]{1}\d{1})(:[0-5]{1}[0-9]{1}){2}$/  // 没有考虑前后关系
const timeReg = /^([01][0-9]|2[0-3])(:[0-5][0-9]){2}$/;
const time = "23:59:59";
// console.log(timeReg.test(time));

// 匹配日期 yyyy/mm/dd类型
const dateReg = /^\d{4}\/(0[1-9]|1[0-2])\/([0-2][0-9]|3[0|1])$/;
const date = "2017/06/09";
// console.log(dateReg.test(date));

// 匹配windows文件路径
// \也需要转译
// [^\\"*<>|"?\r\n/]用来排除特殊字符
// TODO:
const pathReg = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
const path = "F:\\study\\javascript\\regex\\regular expression.pdf";
// console.log(pathReg.test(path));

// 匹配dom中的id
// const idReg = /id="\w+"/g  // 没有考虑id为空的情况，并且可以是任意字符
// 如下，双引号中可以是任意字符，除了"
const idReg = /id="[^"]*"/g;
const id = '<div id="container" class="main"></div>';
// console.log(id.match(idReg))

// 不匹配任何东西的正则
// 只要求一个字符，但该字符后面是开头，不存在。
const noReg = /.^/;
// console.log(noReg.test('1'));

// 千分符
// '12345678' => '12,345,678'
const str = "12345678";
// 找到结尾三个的前一个位置，插入分隔符
console.log(str.replace(/(?=\d{3}$)/, ","));
// 三个为一组，可能有多组，存在的问题是可能在最开头添加,
console.log(str.replace(/(?=(\d{3})+$)/g, ","));
const str1 = "123456";
// 规定开头不能添加,
console.log(str1.replace(/(?!^)(?=(\d{3})+$)/g, ",")); // TODO:难搞。
console.log(str1.replace(/\B(?=(\d{3})+$)/g, ","));

// 格式化
// 1888 => $ 1888.00
const doller = 1888;
console.log(
  doller
    .toFixed(2)
    .replace(/\B(?=(\d{3})+\b)/g, ",")
    .replace(/^/, "$$")
); // TODO:这里为啥可以写两个$， $在正则里面好像是一个特殊字符，如果换成别的符号，会变成两个。

// TODO:
// 密码，6-12位，由数字字母和符号组成，必须包含至少两种字符，比如至少包含数字和小写字符
const passwordReg = /^[0-9a-zA-Z]{6, 12}$/

// 引用，可以提取和替换数据
const d = '2021-09-23'
const dReg = /^(\d{4})-(\d{2})-(\d{2})$/
const res = d.replace(dReg, '$2/$3/$1') // $1,2,3分别代表第1，2，3个分组的值
console.log(res);

// 反向引用， 指在正则表达式本身引用分组的结果，当然只能引用之前出现的分组
const d1Reg = /\d{4}([-./])\d{2}\1\d{2}/g
// console.log(d1Reg.test(d));
const dates = '2021-09-98, 2021/09/90, 2021.03.09 2021-09/34'
console.log(dates.match(d1Reg))  // -和/混用的无法识别