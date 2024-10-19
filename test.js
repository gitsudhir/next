
class MyListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
class MyLinkedList {
  constructor(head = null) {
    this.head = head;
  }
  print() {
    let current = this.head;
    while (current) {
      console.log(" ➡️ .", current.data);
      current = current.next;
    }
  }
  insert(node) {
    let current = this.head;
    if (this.head) {
      while (current?.next) {
        current = current.next;
      }
      current.next = node;
    } else {
      this.head = node;
    }
  }
  toReverseArray(current = this.head, result = []) {
    if (current != null) {
      this.toReverseArray(current.next, result);
      result.push(current.data);
      return result;
    }
  }
  toReverse(current = this.head, previous = null) {
    if (current == null) {
      // Set the head to the last node processed, which becomes the new head.
      this.head = previous;
      return;
    }

    // Store the next node before changing the reference
    let nextNode = current.next;
    // Reverse the `next` pointer of the current node
    current.next = previous;
    // Recurse with the next node and the current node as the new previous
    this.toReverse(nextNode, current);
  }

  toArray(current = this.head, result = []) {
    if (current != null) {
      result.push(current.data);
      this.toArray(current.next, result);
      return result;
    }
  }
  get length() {
    return this.toArray().length;
  }
  delete(data) {
    if (!this.head) {
      return; // List is empty
    }
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    while (current.next !== null) {
      if (current.next.data === data) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}

let list = new MyLinkedList();
let myVal = [1, 2, 3, 4, 5];

for (const val of myVal) {
  const node = new MyListNode(val);
  list.insert(node);
}

// console.log("array linked list = > ", list.toArray());
// console.log("reverse array linked list = > ", list.toReverseArray());
// console.log("linkedlist size is = > ", list.toReverse());
// list.delete(3);
// list.print();
// list.reverse();
//------------ add to number 
/**
 * Definition for singly-linked list.
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
* @param {ListNode} l1
* @param {ListNode} l2
* @return {ListNode}
*/
var addTwoNumbers = function (l1, l2) {
  let stack1 = [];
  let stack2 = [];

  // Push all elements of l1 into stack1
  while (l1 !== null) {
      stack1.push(l1.val);
      l1 = l1.next;
  }

  // Push all elements of l2 into stack2
  while (l2 !== null) {
      stack2.push(l2.val);
      l2 = l2.next;
  }

  let carry = 0;
  let result = null;

  // While there are elements in stack1 or stack2 or there is a carry
  while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
      let sum = carry;

      if (stack1.length > 0) {
          sum += stack1.pop();
      }
      if (stack2.length > 0) {
          sum += stack2.pop();
      }

      // Create a new node with the digit
      let newNode = new ListNode(sum % 10);
      // Adjust the next pointer to point to the current result
      newNode.next = result;
      result = newNode;

      // Update the carry
      carry = Math.floor(sum / 10);
  }

  return result;
};

// -----------------------------------------------------------
var decodeString = function (s) {
  return usingRecursion(s.split(""), []);
};
function usingRecursion(s, stack) {
  if (s[0] > "0" && s[0] < "9") {
    return;
  }
}
// console.log(decodeString("2[abc]3[cd]ef"));

var calculate = function (s) {
  let valueStack = [];
  let operatorStack = [];
  let num = ""; // to accumulate digits
  let lastSign = 1; // +1 for positive, -1 for negative numbers
  let result = 0;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === " ") continue; // bypass spaces

    if (/\d/.test(char)) {
      // Accumulate digit
      num += char;
    } else {
      if (num !== "") {
        result += lastSign * parseInt(num); // Apply last sign to the number
        num = ""; // reset num
      }

      if (char === "+") {
        lastSign = 1; // Update lastSign to positive
      } else if (char === "-") {
        lastSign = -1; // Update lastSign to negative
      } else if (char === "(") {
        // Push current result and sign, and reset for new context
        valueStack.push(result);
        operatorStack.push(lastSign);
        result = 0; // Reset result for new subexpression
        lastSign = 1; // Reset lastSign
      } else if (char === ")") {
        // Complete the subexpression
        if (num !== "") {
          result += lastSign * parseInt(num); // Apply current sign to number
          num = ""; // reset num
        }
        result = operatorStack.pop() * result + valueStack.pop(); // Apply saved sign and add to saved result
      }
    }
  }

  // Add the last accumulated number if there was any
  if (num !== "") {
    result += lastSign * parseInt(num);
  }

  return result;
};

// // Test case
// let stack = "(1+(4+5+2)-3)+(6+8)";
// console.log(calculate(stack)); // Should output 23
function myPartition(array, start, end) {
  // Initialize the pointer for the smaller elements
  let smallerElementIndex = start;
  const pivot = array[end]; // Set the pivot as the last element of the array

  // Iterate over the array from start to one element before the pivot
  for (let currentIndex = start; currentIndex < end; currentIndex++) {
    // If the current element is smaller than the pivot
    if (array[currentIndex] < pivot) {
      // Swap the current element with the element at smallerElementIndex
      [array[smallerElementIndex], array[currentIndex]] = [
        array[currentIndex],
        array[smallerElementIndex],
      ];
      smallerElementIndex++; // Move the smallerElementIndex forward
    }
  }

  // Place the pivot in its correct position
  [array[smallerElementIndex], array[end]] = [
    array[end],
    array[smallerElementIndex],
  ];

  // Log the modified array for debugging purposes
  // console.log(array);

  // Return the index of the pivot after partitioning
  return smallerElementIndex;
}

function myQuickSelect(array, start, end, k) {
  if (array.length == 1 && k == 0) {
    return array[0];
  } else {
    // partition
    const pivotIndex = myPartition(array, start, end);
    if (pivotIndex == k) {
      return array[pivotIndex];
    } else if (pivotIndex < k) {
      return myQuickSelect(array, pivotIndex + 1, end, k);
    } else {
      return myQuickSelect(array, start, pivotIndex - 1, k);
    }
  }
}
const myArray = [11, 2, 6, 9, 20, 30, 1, 3, 7];
const kth = 1;
// console.log(myQuickSelect(myArray, 0, myArray.length - 1, kth - 1)); // Outputs the index of the pivot

function quickSelect(array, start, end, k) {
  if (start <= end) {
    // Check needs to include equality for handling single element partitions
    const pivotIndex = qspartition(array, start, end);

    if (pivotIndex === k) {
      return array[pivotIndex];
    } else if (pivotIndex < k) {
      return quickSelect(array, pivotIndex + 1, end, k); // Search the right side
    } else {
      return quickSelect(array, start, pivotIndex - 1, k); // Search the left side
    }
  }
  return -1; // Return -1 if k is out of bounds
}

function qspartition(array, start, end) {
  const pivot = array[end]; // Pivot set to the last element of the current subarray
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (array[j] < pivot) {
      i++;
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Swap array[i + 1] and array[end] (the pivot)
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  return i + 1; // Return the index of the pivot
}

// Test the function with a sample array
const arrayval = [11, 2, 6, 9, 20, 30, 1, 3, 7];
let k = 2; // Find the 3rd smallest element (0-based index 2)
// let secondLargest = quickSelect(arrayval, 0, arrayval.length - 1, k);
// console.log({ secondLargest }); // Outputs the 3rd smallest element

var superPow = function (a, b) {
  return solve(a, parseInt(b.join("")));
};
function solve(a, b) {
  if (b == 2) {
    return a * a;
  }
  if (b == 1) {
    return a;
  }
  if (b % 2 == 0) {
    return solve(a, Math.floor(b / 2)) * solve(a, Math.floor(b / 2));
  } else {
    return solve(a, Math.floor(b / 2)) * solve(a, Math.floor(b / 2)) * a;
  }
}
// console.log(superPow(2, [1, 0]));
function maxMin(array) {
  if (array.length == 2) {
    return [Math.max(array[0], array[1]), Math.min(array[0], array[1])];
  }
  if (array.length == 1) {
    return [array[0], array[0]];
  }
  let mid = Math.floor(array.length / 2);
  const firstHalf = maxMin(array.slice(0, mid));
  const lastHalf = maxMin(array.slice(mid));

  return [
    Math.max(firstHalf[0], lastHalf[0]),
    Math.min(firstHalf[1], lastHalf[1]),
  ];
}
// console.log(maxMin([9, 6, 4, 7, 10, 14, 8, 11, 1]));
var getMaximumGenerated = function (n) {
  const nums = [];
  nums[0] = 0;
  nums[1] = 1;
  for (let i = 1; i < n / 2; i++) {
    nums[i * 2] = nums[i];
    nums[2 * i + 1] = nums[i] + nums[i + 1];
  }
  return nums;
};
// console.log(getMaximumGenerated(7))
function wordCorrection(s) {
  let upper = 0;
  let lower = 0;
  for (const ch of s) {
    if (/[a-z]/.test(ch)) {
      lower++;
    } else {
      upper++;
    }
  }
  if (lower < upper) {
    return s.toUpperCase();
  } else {
    return s.toLowerCase();
  }
}
// console.log(wordCorrection("HoUse"));
var subsets = function (nums) {
  const times = (1 << nums.length) - 1;
  const result = [];
  for (let i = 0; i <= times; i++) {
    result.push(transform(nums, i, nums.length));
  }
  return result;
};
function transform(nums, i, base) {
  const tempArr = i.toString(2).padStart(base, "0").split("");
  const tempResult = [];
  for (const ind in tempArr) {
    if (tempArr[ind] != "0") {
      tempResult.push(nums[ind]);
    }
  }
  return tempResult;
}
// console.log(subsets([1, 2, 3]));
function rotateArray(array, step) {
  // while (step--) {
  array.unshift(...array.splice(-step));
  // }
  return array;
}

// console.log(rotateArray([1, 2, 3, 4, 5, 6, 7], 3));

function binarSearch(array, item) {
  return bs(array, 0, array.length - 1, item);
}
function bs(array, start, end, item) {
  if (start > end) {
    return -1; // Item not found
  }
  const mid = Math.floor((start + end) / 2);
  if (array[mid] == item) {
    return mid;
  } else if (array[mid] < item) {
    return bs(array, mid + 1, end, item);
  } else {
    return bs(array, start, mid - 1, item);
  }
}
// console.log(binarSearch([3, 9, 10, 27, 38, 43, 82], 10));
var mostFrequentEven = function (nums) {
  let counter = new Map();
  let maxCounter = -Infinity;
  let maxNum = -Infinity;
  for (const num of nums) {
    if (num % 2 == 0) {
      counter.set(num, (counter.get(num) || 0) + 1);
      if (counter.get(num) > maxCounter) {
        maxCounter = counter.get(num);
        maxNum = num;
      }
    }
  }
  // console.log(counter);
  return maxNum;
};
// console.log(mostFrequentEven([2, 2, 1, 1, 1, 2, 2]));

var majorityElement = function (nums) {
  // return nums;
  let counter = new Map();
  let maxCounter = -Infinity;
  let maxNum = -Infinity;
  for (const num of nums) {
    counter.set(num, (counter.get(num) || 0) + 1);
    if (counter.get(num) > maxCounter) {
      maxCounter = counter.get(num);
      maxNum = num;
    }
  }
  console.log(counter);
  return maxNum;
};
// console.log(majorityElement([2, 2, 1, 1, 1, 2, 2]));
// console.log(majorityElement([3,2,3]));

class Solution {
  // Merge Sort Function
  mergeSort(arr) {
    if (arr.length <= 1) return arr; // Base case: if array has one or zero elements, it's already sorted

    const mid = Math.floor(arr.length / 2); // Find the middle point
    const left = this.mergeSort(arr.slice(0, mid)); // Recursively sort the left half
    const right = this.mergeSort(arr.slice(mid)); // Recursively sort the right half

    return this.merge(left, right); // Merge the two sorted halves
  }

  // Merge two sorted arrays
  merge(left, right) {
    const result = [];
    let i = 0,
      j = 0;

    // Compare and merge elements from both arrays
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]); // Add the smaller element and increment the index
      } else {
        result.push(right[j++]);
      }
    }

    // Add any remaining elements from the left or right array
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}

// Example Usage
const solution = new Solution();
// console.log(solution.mergeSort([38, 27, 43, 3, 9, 82, 10])); // Output: [3, 9, 10, 27, 38, 43, 82]

class Solution2 {
  minimumOperations(nums) {
    let count1 = 0,
      count2 = 0,
      count3 = 0;

    // Step 1: Count the number of each group (1s, 2s, 3s)
    for (let num of nums) {
      if (num === 1) count1++;
      else if (num === 2) count2++;
      else if (num === 3) count3++;
    }

    // Step 2: Track misplaced elements in each section
    let misplaced12 = 0,
      misplaced13 = 0; // Misplaced in group 1 section
    let misplaced21 = 0,
      misplaced23 = 0; // Misplaced in group 2 section
    let misplaced31 = 0,
      misplaced32 = 0; // Misplaced in group 3 section

    // Group 1 section: nums[0] to nums[count1 - 1]
    for (let i = 0; i < count1; i++) {
      if (nums[i] === 2) misplaced12++;
      if (nums[i] === 3) misplaced13++;
    }

    // Group 2 section: nums[count1] to nums[count1 + count2 - 1]
    for (let i = count1; i < count1 + count2; i++) {
      if (nums[i] === 1) misplaced21++;
      if (nums[i] === 3) misplaced23++;
    }

    // Group 3 section: nums[count1 + count2] to nums[count1 + count2 + count3 - 1]
    for (let i = count1 + count2; i < count1 + count2 + count3; i++) {
      if (nums[i] === 1) misplaced31++;
      if (nums[i] === 2) misplaced32++;
    }

    // Step 3: Calculate the minimum swaps needed
    // Direct swaps between the misplaced pairs
    let directSwap12 = Math.min(misplaced12, misplaced21);
    let directSwap13 = Math.min(misplaced13, misplaced31);
    let directSwap23 = Math.min(misplaced23, misplaced32);

    // After direct swaps, calculate remaining misplaced guests in cycles
    // Remaining misplaced guests in each group section
    let remainingMisplaced12 = misplaced12 - directSwap12;
    let remainingMisplaced13 = misplaced13 - directSwap13;
    let remainingMisplaced23 = misplaced23 - directSwap23;

    // Cycle swaps: Remaining misplaced guests need 2 swaps to resolve
    let cycleSwaps =
      remainingMisplaced12 + remainingMisplaced13 + remainingMisplaced23;

    // Total swaps: Direct swaps + Cycle swaps
    return directSwap12 + directSwap13 + directSwap23 + cycleSwaps;
  }
}

// Example Usage:
// let solution2 = new Solution2();
// console.log(solution2.minimumOperations([2, 1, 3, 2, 1])); // Output: 3
// console.log(solution2.minimumOperations([1, 3, 2, 1, 3, 3])); // Output: 2
// console.log(solution2.minimumOperations([2, 2, 2, 2, 3, 3])); // Output: 0

function quickSort(array, start, end) {
  if (start < end) {
    const pivotIndex = partition(array, start, end);
    quickSort(array, start, pivotIndex - 1); // Fix recursive call for left partition
    quickSort(array, pivotIndex + 1, end); // Fix recursive call for right partition
  }
}
function _quickSelect(array, start, end, k) {
  if (start < end) {
    const pivotIndex = partition(array, start, end);
    if (pivotIndex == k) {
      return array[pivotIndex];
    } else if (pivotIndex < k) {
      return quickSelect(array, start, pivotIndex - 1, k); // Fix recursive call for left partition
    } else {
      return quickSelect(array, pivotIndex + 1, end, k); // Fix recursive call for right partition
    }
  }
}
function _partition(array, start, end) {
  const pivot = array[end]; // Pivot set to the last element of the current subarray
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (array[j] < pivot) {
      i++;
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Swap array[i + 1] and array[end] (the pivot)
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  return i + 1; // Return the index of the pivot
}

const array = [11, 2, 6, 9, 20, 30, 1, 3, 7];
let val = quickSelect(array, 0, array.length - 1, 2);
// console.log({ val }); // Outputs the sorted array

// function solve(inventory1, inventory2) {
//   //Write your code here
//   let result = [];
//   const strArry1 = inventory1.split(" ");
//   const strArry2 = inventory2.split(" ");
//   let str1Inc = 0;
//   let str2Inc = 0;

//   while (str1Inc < strArry1.length && str2Inc < strArry2.length) {
//     if (String(strArry1[str1Inc]).localeCompare(strArry2[str2Inc]) <= 0) {
//       result.push(strArry1[str1Inc]);
//       str1Inc++;
//     } else {
//       result.push(strArry2[str2Inc]);
//       str2Inc++;
//     }
//   }
//   result = result.concat(strArry1.slice(str1Inc), strArry2.slice(str2Inc));
//   return result.join(" ");
// }
// console.log(solve("book enchanted spell wand", "ancient dragon magic scroll"));

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i]; // store the current element
    let j = i - 1;

    // Shift elements that are greater than current to one position ahead
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j]; // Shift the larger element
      j--;
    }

    // Insert the current element into its correct position
    arr[j + 1] = current;
  }
  return arr;
}

// console.log(insertionSort([11, 2, 6, 9, 20]));

function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = arr[i];
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (min > arr[j]) {
        min = arr[j];
        minIndex = j;
      }
    }
    //swap
    let temp = arr[i];
    arr[i] = min;
    arr[minIndex] = temp;
  }
  return arr;
}
// console.log(selectionSort([11, 2, 6, 9, 20]));
class Solution1 {
  // Merge sort function
  mergeSort(arr, left, right) {
    if (right - left <= 1) {
      return arr.slice(left, right); // Return subarray when size is 1 or less
    }

    const mid = Math.floor((left + right) / 2);
    return this.merge(
      this.mergeSort(arr, left, mid),
      this.mergeSort(arr, mid, right)
    );
  }

  // Merge two sorted arrays
  merge(left, right) {
    const result = [];
    let i = 0,
      j = 0;

    // Compare elements of left and right arrays
    while (i < left.length && j < right.length) {
      result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    }

    // Append remaining elements from both arrays
    return result.concat(left.slice(i), right.slice(j));
  }
}

// Input
const solution1 = new Solution1();
const arr = [11, 2, 6, 9, 20];

// Sort the array and print the output
// console.log(solution.mergeSort(arr, 0, arr.length).join(' '));  // Output: 2 6 9 11 20

function mergeSort(arr) {
  // console.log(arr);
  let len = arr.length;
  if (len <= 1) {
    return arr;
  }
  const mid = len >> 1;

  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] > right[j]) {
      result.push(right[j]);
      j++;
    } else {
      result.push(left[i]);
      i++;
    }
  }
  result.push(...left.slice(i));
  result.push(...right.slice(j));
  return result;
}
// console.log(mergeSort([7, 2, 8, 9, 5,21,0]));

function bubbleSort(arr) {
  let swapCount = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      //swap
      let now = arr[j];
      let next = arr[j + 1];
      if (now > next) {
        arr[j] = next;
        arr[j + 1] = now;
        swapCount++;
      }
    }
  }

  return arr;
}
// console.log(bubbleSort([7 ,2 ,8 ,9 ,5]));
// console.log(bubbleSort([4 ,6 ,2 ,5 ,3]));

function findCurrency(votes) {
  const map = new Map();
  for (const vote of votes) {
    map.set(vote, (map.get(vote) || 0) + 1);
  }
  const result = [];
  for (const [key, val] of map) {
    console.log(key, "=>", val);
    if (val > 1) {
      result.push(key);
    }
  }
  return result;
}
let votes = [4, 3, 2, 1, 2, 1];
// console.log(findCurrency(votes))
var stringMatching = function (words) {
  const result = [];
  for (let i = 0; i < words.length; i += 1) {
    const mainWord = words[i];

    for (let j = 0; j < words.length; j += 1) {
      if (i != j) {
        const subWord = words[j];
        if (mainWord.includes(subWord)) {
          result.push(subWord);
        }
        if (subWord.includes(mainWord)) {
          result.push(mainWord);
        }
      }
    }
  }
  return Array.from(new Set(result));
};
// console.log(stringMatching(["mass","as","hero","superhero"]));

var gcdOfStrings = function (str1, str2) {
  const set1 = new Set([...str1]);
  const set2 = new Set([...str2]);
  let result = "";
  const set1Str = [...set1].join("");
  const set2Str = [...set2].join("");
  if (set1Str.includes(set2Str)) {
    result += set2Str;
  }

  return result;
};
// console.log(gcdOfStrings("ABCABC", "ABC"))
// console.log(gcdOfStrings("ABABAB", "ABAB"))
// console.log(gcdOfStrings("LEET", "CODE"))

function sortString(s) {
  const mMap = new Map();
  for (const val of s) {
    mMap.set(val, (mMap.get(val) || 0) + 1);
  }
  return mMap;
}
const input = "ssgysyqa"; //'sssyyagq';
// console.log(sortString(input));

var restoreString = function (s, indices) {
  let resultStr = [];
  for (let i = 0; i < indices.length; i += 1) {
    const index = indices[i];
    const val = s[i];
    resultStr[index] = val;
  }
  return resultStr.join("");
};
// console.log(restoreString("codeleet",[4,5,6,7,0,2,1,3]));

var isValid = function (s) {
  const stack = [];
  const parenMap = new Map();
  parenMap.set(")", "(");
  parenMap.set("}", "{");
  parenMap.set("]", "[");

  for (const char of s) {
    if (stack.length && stack.at(-1) == parenMap.get(char)) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack.length == 0;
};
// console.log(isValid("()[]{}"));
// console.log(isValid("(]{}"));

var isHappy = function (n) {
  const chache = new Map();
  while (n != 1) {
    if (chache.has(n)) {
      return false;
    }
    chache.set(n, true);
    // new n
    n = String(n)
      .split("")
      .map((v) => Number(v) ** 2)
      .reduce((a, b) => a + b, 0);
    //  console.log(n);
  }
  return true;
};
// console.log(isHappy(19));
// console.log(isHappy(2));

var productExceptSelf = function (nums) {
  const suffix = [];
  const prefix = [];
  const { length } = nums;
  for (let i = 0; i < length; i += 1) {
    prefix[i] = (prefix.at(i - 1) ?? 1) * nums[i];
    suffix[length - 1 - i] =
      (suffix.at(length - 1 - i + 1) ?? 1) * nums[length - 1 - i];
  }
  for (let i = 0; i < length; i += 1) {
    const p = i - 1 < 0 ? 1 : prefix.at(i - 1) ?? 1;
    const s = i + 1 > length ? 1 : suffix.at(i + 1) ?? 1;
    nums[i] = p * s;
  }
  console.log(prefix, suffix);
  return nums;
  /*
  [ 1, 2, 6, 24 ] 
  [ 24, 24, 12, 4 ]
  */
};

// console.log(productExceptSelf([1, 2, 3, 4])); // [24,12,8,6]

// console.log(productExceptSelf([-1,1,0,-3,3])); // [0,0,9,0,0]

var compress = function (chars) {
  let firstPointer = 0;
  let prevChar = chars[0];
  let count = 1;

  for (let i = 1; i < chars.length; i += 1) {
    const nowChar = chars[i];
    if (prevChar == nowChar) {
      count += 1;
    } else {
      chars.splice(firstPointer, count, prevChar);
      if (count != 1) {
        chars.splice(firstPointer + 1, 0, ...count.toString().split(""));
      }
      prevChar = nowChar;
      i = i - count - 2;
      count = 1; // reset
      firstPointer = i;
      // reset the i
    }
  }

  chars.splice(firstPointer, count, prevChar);
  if (count != 1) {
    chars.splice(firstPointer + 1, 0, ...count.toString().split(""));
  }
  return chars;
};
// console.log(compress(["a","a","a","b","b","a","a"]));
// console.log(compress(["a", "a", "b", "b", "c", "c", "c"]));
// console.log(compress(["a","b","b","b","b","b","b","b","b","b","b","b","b"]));

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
var _decodeString = function (s) {
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
