var compress = function (chars) {

  let prevChar = chars[0];
  let count = 1;
  const result = [];
  for (let i = 1; i < chars.length; i += 1) {
    const nowChar = chars[i];
    if (prevChar == nowChar) {
      count += 1;
    } else {
      result.push(prevChar, count);
      prevChar = nowChar;
      count = 1; // reset
    }
  }
  result.push(prevChar, count);
  return result;
};
console.log(compress(["a", "a", "b", "b", "c", "c", "c"]));
// console.log(compress(["a", "a", "b", "b", "c", "c", "c"]));

var countBits = function (n) {
  /*
0 --> 0 = 0
1 --> 1 = 1
2 --> 10= 1   
3 --> 11= 2

4 --> 100=1
5 --> 101=2
6     110=2
7     111=3

8    1000=1
9    1001=2
10   1010=2
11   1011=3
12   1100=2
13   1101=3
14   1110=3
15   1111=4

    */
  const series = [0, 1, 1, 2];
  for (let i = 4; i <= n; i++) {
    const toPrevious = 2 ** Math.floor(Math.log2(i));
    series[i] = series[i - toPrevious] + 1;
  }
  if (n < 4) {
    series.splice(n + 1);
    return series.pop();
  } else {
    return series.pop();
  }
};
// console.log(countBits(11));
var tribonacci = function (n) {
  const series = [0, 1, 1];
  for (let i = 3; i <= n; i++) {
    series[i] = series[i - 1] + series[i - 2] + series[i - 3];
  }
  return series[n];
};

// const n = 25;
// console.log(tribonacci(25));
// Output: 1389537
// Compute Factorial program using dynamic programming.
function factorialDP(num) {
  let factStoredInArray = [1];
  for (let i = factStoredInArray.length; i <= num; i += 1) {
    factStoredInArray[i] = i * factStoredInArray[i - 1];
  }
  return factStoredInArray[num];
}
// console.log(factorialDP(10)); //3628800
var decodeString = function (s) {
  const result = [];
  const defaultObj = {
    time: 0,
    char: "",
    start: true,
  };
  for (const char of s) {
    // number pattern
    const numPat = /\d/g;
    const charPat = /\w/g;
    if (numPat.test(char)) {
      // console.log("this is number=>", char);
      let { time, char: prevChar, start } = result.pop() || defaultObj;
      if (start) {
        // console.log("=> make the number = >", start, time, prevChar);
        time = time * 10 + parseInt(char);
      } else {
        const timeChar = {
          time: time,
          char: prevChar,
          start: true,
        };
        result.push(timeChar);
        time = char;
      }
      const timeChar = {
        time: time,
        char: "",
        start: true,
      };
      result.push(timeChar);
    } else if (charPat.test(char)) {
      // console.log("this is character=>", char);
      let { time, char: prevChar } = result.pop() || defaultObj;
      prevChar = prevChar + char;
      const timeChar = {
        time: time,
        char: prevChar,
      };
      result.push(timeChar);
    } else {
      // console.log("Bracket = > ", char);
      if (char == "[") {
        // timechar same -
        let { time, char: prevChar, start } = result.pop() || defaultObj;
        const timeChar = {
          time: time,
          char: prevChar,
          start: false,
        };
        result.push(timeChar);
      } else {
        // ']'
        let { time, char: prevChar } = result.pop() || defaultObj;
        // make the string
        const makeString = prevChar.repeat(time);
        let { time: nextTime, char: nextChar } = result.pop() || defaultObj;
        nextChar = nextChar + makeString;
        const timeChar = {
          time: nextTime,
          char: nextChar,
        };
        result.push(timeChar);
      }
    }
  }
  return result[0].char;
};
// console.log(decodeString("3[a2[c]]"));
// console.log(decodeString("13[a2[c]]"));

// console.log(decodeString("2[abc]3[cd]ef"));

var removeStars = function (s) {
  let result = [];
  for (const char of s) {
    if (char == "*") {
      result.pop();
    } else {
      result.push(char);
    }
  }
  return result.join("");
};

// console.log(removeStars("leet**cod*e"))
// console.log(removeStars("erase*****"))

var reverseWords = function (s) {
  let st = s.trim().split(" ").reverse();
  return st;
};
// console.log(reverseWords("the sky is blue"))
var intToRoman = function (num) {
  let i = 0;
  let string = "";

  while (num) {
    const digit = num % 10;
    num = Math.floor(num / 10);
    i += 1;

    const valChar = calculateCharsFromNum(digit, i);
    string = `${valChar}${string}`;
  }
  return string;
};
function calculateCharsFromNum(num, index) {
  const charValMap = {
    1: ["I", "V"],
    2: ["X", "L"],
    3: ["C", "D"],
    4: ["M"],
  };
  if (num == 9) {
    if (index != 4) {
      const nextStartChar = charValMap[index + 1][0];
      const nowStartChar = charValMap[index][0];

      const valChar = "" + nowStartChar + nextStartChar;
      return valChar;
    }
  } else if (num == 4) {
    if (index != 4) {
      const nextStartChar = charValMap[index][1];
      const nowStartChar = charValMap[index][0];

      const valChar = "" + nowStartChar + nextStartChar;
      return valChar;
    }
    console.log();
  } else if (num >= 5) {
    if (index != 4) {
      const nextStartChar = charValMap[index][1];
      const nowStartChar = charValMap[index][0];

      const times = num - 5;
      const valChar = nextStartChar + nowStartChar.repeat(times);
      return valChar;
    }
    console.log();
  } else if (num < 5) {
    if (index != 4) {
      const nowStartChar = charValMap[index][0];
      const valChar = nowStartChar.repeat(num);
      return valChar;
    } else {
      const nowStartChar = charValMap[index][0];
      const valChar = nowStartChar.repeat(num);
      return valChar;
    }
  }
}
// console.log(intToRoman(3749));
// console.log(intToRoman(58));

// console.log(intToRoman(1994));
// console.log(intToRoman(20));

//MMM DCC XL IX
//MMM DCC XL IX
var romanToInt = function (s) {
  const symbolValueMap = {
    U: { val: 0, index: 0 },
    I: { val: 1, index: 1 },
    V: { val: 5, index: 2 },
    X: { val: 10, index: 3 },
    L: { val: 50, index: 4 },
    C: { val: 100, index: 5 },
    D: { val: 500, index: 6 },
    M: { val: 1000, index: 7 },
  };
  let totalSum = 0;
  for (let i = 0; i < s.length; ) {
    let next = i + 1;
    const firstChar = s[i];
    const nextChar = s.at(next) || "U";

    const { val: valNow, index: indexNow } = symbolValueMap[firstChar];
    const { val: valNext, index: indexNext } = symbolValueMap[nextChar];

    let nowSum = 0;
    if (indexNext > indexNow) {
      nowSum = valNext - valNow;
      i += 2;
    } else {
      nowSum = valNow;
      i += 1;
    }
    totalSum += nowSum;
  }
  return totalSum;
};

// console.log(romanToInt("MCMXCIV"));
// console.log(romanToInt("LVIII"));
// console.log(romanToInt("III"));

var pivotIndex = function (nums) {
  const left = [];
  for (let i = 0; i < nums.length; i += 1) {
    left[i] = (left.at(i - 1) || 0) + nums[i];
  }
  // console.log(left);

  const right = [];
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    right[i] = (right.at(i + 1) || 0) + nums[i];
  }
  // console.log(right);
  for (let i = 0; i < nums.length; i += 1) {
    if (left[i] - right[i] == 0) return i;
  }
  return -1;
};

// console.log(pivotIndex([1,7,3,6,5,6]))
// console.log(pivotIndex([1,2,3]))
// console.log(pivotIndex([2,1,-1]))

var largestAltitude = function (gain) {
  console.log(gain);
  let max = 0;
  let sum = 0;
  for (let i = 0; i < gain.length; i += 1) {
    sum += gain[i];
    if (max <= sum) {
      max = sum;
    }
  }
  return max;
};
// console.log(largestAltitude([-4, -3, -2, -1, 4, 3, 2]));
// console.log(largestAltitude([-5, 1, 5, 0, -7]));

var isSubsequence = function (s, t) {
  const sourceMap = s.split("").reduce((acc, curr, index) => {
    acc[curr] = index;
    return acc;
  }, {});
  const targetMap = t.split("").reduce((acc, curr, index) => {
    acc[curr] = index;
    return acc;
  }, {});
  for (const val of s) {
    if (val in targetMap) {
      const sIndex = sourceMap[val];
      const tIndex = targetMap[val];
      if (sIndex < s.length) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
// console.log(isSubsequence("aec","abcde"))
// console.log(isSubsequence("axc","ahbgdc"))
// console.log(isSubsequence("abc","ahbgdc"))
// console.log(isSubsequence("ace","abcde"))

var isPalindrome = function (s) {
  let firstPointer = 0;
  let secondPointer = s.length - 1;
  while (firstPointer < secondPointer) {
    let fistChar = s.at(firstPointer);
    let pattern = /[a-zA-Z]/g;
    if (!pattern.test(fistChar)) {
      firstPointer += 1;
      continue;
    }
    let secondChar = s.at(secondPointer);
    let pattern2 = /[a-zA-Z]/g;

    if (!pattern2.test(secondChar)) {
      secondPointer -= 1;
      continue;
    }
    if (fistChar.toUpperCase() !== secondChar.toUpperCase()) {
      return false;
    }
    firstPointer += 1;
    secondPointer -= 1;
  }
  return true;
};
const s = "race a car";
// console.log(isPalindrome(s));

var myPow = function (x, n) {
  return recursive(x, n);
};
function recursive(num, time) {
  console.log("time = > ", time);
  if (time == 2) {
    console.log("num 2 =>", num);
    return num * num;
  }
  if (time <= 1) {
    console.log("num 1 =>", num);
    return num;
  }
  const val = recursive(num, Math.floor(time / 2));
  console.log("val = > ", val);
  if (time % 2 == 0) {
    return val * val;
  } else {
    return val * val * num;
  }
}
// console.log(myPow(2.0000, 10));

var plusOne = function (digits) {
  let length = digits.length;
  if (digits[length - 1] < 9) {
    digits[length - 1] += 1;
  }
  while (digits[length - 1] == 9) {
    digits[length - 1] = 0;
    length -= 1;
  }
  if (length == 0) {
    digits.unshift(1);
  } else {
    digits[length - 1] += 1;
  }

  return digits;
};

// console.log(plusOne([8, 9, 9, 9]));

// console.log(plusOne([9, 9]));
// console.log(plusOne([9]));

// console.log(plusOne([1, 2, 3]));

// console.log(plusOne([4, 3, 2, 1]));

var _isPalindrome = function (x) {
  if (x < 0) {
    return false;
  }
  if (x % 10 == 0) {
    return false;
  }

  let firstPointer = Math.floor(Math.log10(x)) + 1;
  let secondPointer = 1;
  while (firstPointer > secondPointer) {
    if (getDigit(x, firstPointer) !== getDigit(x, secondPointer)) {
      return false;
    }
    firstPointer -= 1;
    secondPointer += 1;
  }
  return true;
};
function getDigit(number, n) {
  return Math.floor((number / Math.pow(10, n - 1)) % 10);
}
// console.log(isPalindrome(121));
// console.log(isPalindrome(-121));
// console.log(isPalindrome(12));

var largestPalindrome = function (n, k) {
  if (n == 1) {
    return k > 5 ? k : k * 2;
  }
  if (k == 5) {
    return insertFive(n);
  }
  if (k == 2) {
    return insertTwo(n);
  }
  if (k == 4) {
    if (n == 2) {
      return 88;
    }
    return insertFour(n);
  }
};
function insertFour(times) {
  let num = new Array(times).fill(9);
  num[0] = 6;
  num[times - 1] = 6;
  num[1] = 3;
  num[times - 2] = 3;

  return parseInt(num.join(""));
}
function insertTwo(times) {
  let num = new Array(times).fill(9);
  num[0] = 2;
  num[times - 1] = 2;
  return parseInt(num.join(""));
}
function insertFive(times) {
  let num = new Array(times).fill(9);
  num[0] = 5;
  num[times - 1] = 5;
  return parseInt(num.join(""));
}
// console.log(largestPalindrome(1,4))
// console.log(largestPalindrome(3,5))
// console.log(largestPalindrome(3,4))

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  let length = 0;
  let temp = head;
  let temp2 = head;
  while (head) {
    head = head.next;
    length++;
  }

  // console.log({ length });
  let counter = length - n;
  // reset
  head = temp;
  temp2 = head;
  while (counter) {
    counter--;
    head = head.next;
  }
  if (head) {
    if (head.next) {
      head.val = head.next.val;
      head.next = head.next.next;
    } else {
      head = null;
    }
  }
  return head;
};
function sum(a, b, carry) {
  const total = a + b + carry;
  console.log({ a, b, carry });
  console.log([parseInt(total % 10), parseInt(total / 10)]);

  return [parseInt(total % 10), parseInt(total / 10)];
}
var addTwoNumbers = function (l1, l2) {
  let result = null;
  let s = 0;
  while (l1 !== null || l2 !== null) {
    const [unit, curry] = sum(l1?.val || 0, l2?.val || 0, s);

    result = new ListNode(unit, result);
    s = curry;
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  if (s) {
    result = new ListNode(1, result);
  }
  return reverse(result);
};

const reverse = (head) => {
  if (!head || !head.next) {
    return head;
  }
  let temp = reverse(head.next);
  head.next.next = head;
  head.next = null;
  return temp;
};
class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

const list1 = [4, 5, 1, 9].reduceRight((acc, curr) => {
  if (acc == null) {
    acc = new ListNode(curr);
  } else {
    acc = new ListNode(curr, acc);
  }
  return acc;
}, null);

const list2 = [5, 6, 4].reduceRight((acc, curr) => {
  if (acc == null) {
    acc = new ListNode(curr);
  } else {
    acc = new ListNode(curr, acc);
  }
  return acc;
}, null);

// console.log(list1)
// console.log(list2)
const head = [1, 2].reduceRight((acc, curr) => {
  if (acc == null) {
    acc = new ListNode(curr);
  } else {
    acc = new ListNode(curr, acc);
  }
  return acc;
}, null);
const n = 1;
let result = null || removeNthFromEnd(head, n);
// console.log({ result });
while (result) {
  console.log("->", result.val);
  result = result.next;
}
