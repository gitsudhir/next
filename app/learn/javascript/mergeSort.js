function mergeSort(arr){
    return arr;
}
function merge(arr1,arr2){
    const result = [];
    let firstArrPointer = 0;
    let secondArrPointer = 0;
    let {length : firstArrTotalLen} = arr1;
    let {length : secondArrTotalLen} = arr2;
    while(firstArrPointer < firstArrTotalLen && secondArrPointer < secondArrTotalLen ){
        const firstArrValue = arr1.at(firstArrPointer);
        const secondArrValue = arr2.at(secondArrPointer);
        if(firstArrValue < secondArrValue){
         result.push(firstArrValue);
         firstArrPointer+=1;
        }else{
           result.push(secondArrValue);
           secondArrPointer+=1;
        }
    }
    while(firstArrPointer<firstArrTotalLen){
        result.push(arr1.at(firstArrPointer));
        firstArrPointer+=1;
    }
    while(secondArrPointer<secondArrTotalLen){
        result.push(arr2.at(secondArrPointer));
        secondArrPointer+=1
    }
    return result;
}
console.log(merge([3,5,6,9,10,12,11],[1,2,7,8]));
const result = mergeSort([]);