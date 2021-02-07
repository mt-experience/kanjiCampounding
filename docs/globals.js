'use strict'
// 熟語を20個取ってくる
const jukugos = randomArray(fullJukugo, 20)
// 重複のない文字にばらす
const kanjis = (function (){
    const chars = uniqueChars(jukugos.join(''))
    return randomArray(chars, chars.length)
  })();

const buttonIdPrefix = "kanji" // 漢字ボタンのIDの頭に付ける
const players = {  // q:リストを選択できるquery
    A:{name:"A", q:"#a-list"}, 
    B:{name:"B", q:"#b-list"},
	getByName: function(name){
	  if(this.A.name === name){ return this.A }
	  if(this.B.name === name){ return this.B }
	  return; // undefined
	},
	getOpponentByName: function(name){
	  if(this.A.name === name){ return this.B }
	  if(this.B.name === name){ return this.A }
	  return; // undefined
	},
  }
const fields = {A:"A", B:"B", Free:"Free"} // 獲得or手つかずの場
var selectedKanjiIds = [] // 選択されている漢字ボタンのID
const qs = (q) => document.querySelector(q) // 長いので
const qsAll = (q) => document.querySelectorAll(q)


// 漢字が被りやすい熟語の選定
// 熟語5個を取ってきて、漢字が被る4つを取ってくるなど
function smartSelect(fullArr, baseNum, bringNum){
  const base = randomArray(fullArr, baseNum)
  // 1語ずつ uniqueChars して、fullArrの各語と比較。一致件数が多いものからとってくる
  // ただし、最も一致するのはその語自身なので除外。
  // uniqueChars(b).sort // [亜,帯,熱]
  base.map(b => {
    uniqueChars(b).sort()
  })
}

// fullArrから無作為に重複しないnum個選択したサブセットを返す。
// numをfullArr.lengthにすれば順番をランダムにすることもできる。
function randomArray(fullArr, num){
  const seq = [...Array(fullArr.length).keys()]
  let arr = []
  let iSeq
  for(let i=0; i < num; i++){
	iSeq = Math.floor(Math.random() * seq.length)
    arr.push(fullArr[seq[iSeq]])
	seq.splice(iSeq, 1)  // sequenseからは削除
  }
  return arr
}

// 文字列を重複ない1文字の配列にする
function uniqueChars(str){
  return [...new Set(str.match(/./g))]
}