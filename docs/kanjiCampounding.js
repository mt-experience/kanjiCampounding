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
var selectedKanjiIds = [] // 選択されている漢字ボタンのID
const qs = (q) => document.querySelector(q) // 長いので


window.addEventListener("load", function(){
  // 漢字ボタンをfree-listに配置
  kanjis.map((text, i) => appendButton(qs('#free-list'), text, i))
  // 白紙にするボタン
  qs('#clear-button').addEventListener("click", () =>{
    qs('#input-text').value = "" // 回答エリアを空にして
	selectedKanjiIds = [] // 選択状態も白紙に
  })
  
  // 回答ボタン
  qs('#judge-button').addEventListener("click", () =>{
	const thisBtn = qs('#judge-button')
	const ansr = players.getByName(thisBtn.value)
    const isValid = fullJukugo.some(item => item === qs('#input-text').value)
	if(isValid){
	  // ボタンの移動
	  selectedKanjiIds = [...new Set(selectedKanjiIds)] // 重複を消す
	  selectedKanjiIds.map(id => { qs(ansr.q).appendChild(qs('#'+id)) })
	}
	qs('#clear-button').click() //  回答エリアを空に、選択状態を白紙に
	const opponent = players.getOpponentByName(ansr.name) // 回答権を相手に
	thisBtn.value = opponent.name
	thisBtn.innerText = opponent.name + "の回答"
  })
  
  // メモ: 指標A==被ってた文字数(少なくともn文字は取り合いが発生しうる)
  qs('#note').innerText += "指標A="+(jukugos.join('').match(/./g).length - kanjis.length)
  qs('#note').innerText += ", 文字数=" + kanjis.length
}, false)



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

// textをinnerTextにしたbuttonを作成、parentに加える。
// buttonをクリックしたら回答エリアに文字を追加する。
// 同じ漢字は複数回使用できる。
function appendButton(parent, text, idNum){
  const id = buttonIdPrefix + idNum
  const btn = document.createElement('button')
  btn.innerText = text
  btn.value = "free" // 漢字ボタンのvalueは所有者を表す
  btn.id = id
  btn.addEventListener("click", () => {
    qs('#input-text').value += text // 回答エリアに文字を追加
	selectedKanjiIds.push(id) // idを追加。重複は防げない。
  })
  parent.appendChild(btn)
}
