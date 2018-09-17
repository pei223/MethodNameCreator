import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import logo from './logo.svg'
import progressbar from './img/progressbar.png'
import SearchBox from './SearchBox'
import './App.css'

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  /**
   * 英語テキストをクリップボードにコピーする
   */
  copyEnText(){
    let enTextElem = document.getElementById("enText")
    let enText = enTextElem.value
    // クリップボードにコピー
    var ta = document.createElement("input")
    ta.value = enText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.parentElement.removeChild(ta)
    enTextElem.focus()
  }

  setEnText(enText) {
    document.getElementById("enText").value = enText
  }

  showProgressBar() {
    document.getElementById("progressbar-box").style.display = "block"
  }
  hideProgressBar() {
    document.getElementById("progressbar-box").style.display = "none"
  }

  render() {
    // TODO BootStrapでデバイス毎にレスポンシブにする
    return (
        <div className="Body">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Method Name Creator</h1>
              <h2 className="App-title">メソッド・変数名を日本語から変換します</h2>
            </header>
          </div>
          <div className="container app-container col-offset-1 col-10 col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
            <SearchBox setEnText={this.setEnText.bind(this)} showProgressBar={this.showProgressBar.bind(this)} hideProgressBar={this.hideProgressBar.bind(this)} />
            <p className="arrow-box">
              <span className="arrow">∨</span>
            </p>
            <div className="row">
              <input id="enText" type="text" placeholder="英語の関数・変数名" className="col-9 col-sm-9 col-md-10 col-lg-10 form-control" onKeyUp={this.copyEnText} />
              <button type="button" className="btn btn-success col-3 col-sm-3 col-md-2 col-lg-2" onClick={this.copyEnText}>Copy</button>
            </div>
          </div>
          <div className="progressbar-box" id="progressbar-box">
            <img src={progressbar} className="progress-circle" id="progressbar" />
            <p className="progress-text">loading...</p>
          </div>
        </div>
    )
  }
}