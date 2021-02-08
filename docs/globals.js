'use strict'
// 全ての熟語。判定にも使う。4列目。
const fullJukugo = (arr => arr.map(x => x[4]))(db)
// 熟語選出用  // 熟語選出スコアは既に選んだ熟語と重複度が高いと高くなる。
const fullUniqsort = (arr => arr.map(x => x[5]))(db) // 重複度計算用 
// インデックスがほしいのでスコアは2次元配列  // [0:インデックス, 1:スコア]
let jukugoScore = Array(fullUniqsort.length).fill(0)
jukugoScore.map((v,i) => jukugoScore[i] = [i,0])
// 熟語を30個取ってくる
const jukugos = smartSelect(fullJukugo, 5, 25)
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
// 熟語5個を取ってきて、漢字が被る(ことを示すスコアが高い)15個取ってくるなど
function smartSelect(fullArr, baseNum, bringNum){
  const base = randomArray(fullArr, baseNum)
  // 1語ずつ uniqueChars して、fullArrの各語と比較。一致件数が多いものからとってくる
  // base単語から全熟語のスコアを計算する。
  base.map( b => addScore(b))
  // 合格点以上のものをランダムにbringNum個取ってくる
  const pass = jukugoScore.concat().sort((a,b)=>b[1]-a[1]).slice(bringNum-1, bringNum)[0][1]
  const juk = randomArray(jukugoScore.filter(v => v[1] >= pass) , bringNum)
                  .map(arr => fullJukugo[arr[0]])
  return base.concat(juk)
}
// 重複度(Multiplicity)を計算する。選定スコアに加算する。
// 「入力単語の各文字」に対して「全熟語」のスコアを計算する。文字列長*DBサイズのコスト。
// 1:1の重複度は[亜熱帯],[亜寒帯] -> 2  // [十人十色],[十中八九] -> 1
function addScore(str){
  uniqueChars(str).map( s => {
	// jukugoScore[i][1] スコア
    fullUniqsort.map((word,i) => jukugoScore[i][1] += word.includes(s)?1:0 )
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