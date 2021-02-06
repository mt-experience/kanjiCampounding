'use strict'
window.addEventListener("load", function(){
  // 漢字ボタンをfree-listに配置
  kanjis.map((text, i) => appendKanjiButton(qs('#free-list'), text, i))
  
  // 白紙にするボタン
  qs('#clear-button').addEventListener("click", () =>{
    qs('#input-text').value = "" // 回答エリアを空にして
	selectedKanjiIds = [] // 選択状態も白紙に
  })
  
  // 回答ボタン
  qs('#judge-button').addEventListener("click", () =>{
	const judgeBtn = qs('#judge-button')
	const ansr = players.getByName(judgeBtn.value)
	if(isValidJukugo(qs('#input-text').value, selectedKanjiIds)){
	  // ボタンの移動
	  selectedKanjiIds = [...new Set(selectedKanjiIds)] // 重複を消す
	  selectedKanjiIds.map(id => { qs(ansr.q).appendChild(qs('#'+id)) })
	}
	qs('#clear-button').click() //  回答エリアを空に、選択状態を白紙に
	const opponent = players.getOpponentByName(ansr.name)
	judgeBtn.value = opponent.name  // 漢字ボタンのvalueは所有者を表す
	judgeBtn.innerText = opponent.name + "の回答"
  })
  
  // お知らせ欄をクリックしたら消える
  qs('#information-text').addEventListener("click", () => {
    qs('#information-text').value = ""
  })
  // メモ: 指標A==被ってた文字数(少なくともn文字は取り合いが発生しうる)
  qs('#note').innerText += "指標A="+(jukugos.join('').match(/./g).length - kanjis.length)
  qs('#note').innerText += ", 文字数=" + kanjis.length
}, false)

// 辞書にあるか。かつ、少なくとも1文字が未取得漢字か。 // 副作用として、エラーメッセージを表示する
function isValidJukugo(jukugo, kanjiIds){
  // 少なくとも1文字が手つかずに入ってるか // 選択された漢字のIDが未取得漢字IDsに含まれるか
  const freeIds = []
　　qsAll('#free-list button').forEach(i => freeIds.push(i.id))
  if(!kanjiIds.some(v => freeIds.includes(v))){
	  qs('#information-text').value = "手つかずな漢字を1字以上選んでください。"
	  setTimeout( ()=>{qs('#information-text').click()}, 3000 ) // 2.5s後に間違うと0.5s後に消える
	  return false
  }
  // 辞書にあるか
  if(!fullJukugo.some(v => v === jukugo)){
	  qs('#information-text').value = "辞書にない熟語です。"
	  setTimeout( ()=>{qs('#information-text').click()}, 3000 )
	  return false
  }
  return true
}

// textをinnerTextにしたbuttonを作成、parentに加える。
// buttonをクリックしたら回答エリアに文字を追加する。
// 同じ漢字は複数回使用できる。
function appendKanjiButton(parent, text, idNum){
  const id = buttonIdPrefix + idNum
  const btn = document.createElement('button')
  btn.innerText = text
  btn.value = fields.Free // 漢字ボタンのvalueは所有者を表す
  btn.id = id
  btn.addEventListener("click", () => {
    qs('#input-text').value += text // 回答エリアに文字を追加
	selectedKanjiIds.push(id) // idを追加。重複は防げない。
  })
  parent.appendChild(btn)
}
