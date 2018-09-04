import React from 'react';
import logo from './logo.svg';
import config from "./config.json"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const SCOPES = 'https://www.googleapis.com/auth/script.projects'
const DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"]


export default class App extends React.Component {
  constructor(props){
    super(props)
    // GoogleのクライアントAPIセットアップ
    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = () => {
      window.gapi.load('client:auth2:client/request:client/script/scripts', () => {
        window.gapi.auth.authorize({client_id: config.CLIENT_ID, scope: SCOPES, immediate: true}, this.initClient)
      });
    };
    document.body.appendChild(script);
  }

  /**
   * 英語テキストをクリップボードにコピーする
   */
  copyEnText (){
    let enTextElem = document.getElementById("enText")
    let enText = enTextElem.value
    // クリップボードにコピー
    var ta = document.createElement("textarea")
    ta.value = enText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.parentElement.removeChild(ta)
    enTextElem.focus()
  }

  /**
   * 日本語から指定した条件で関数・変数名などに変換する
   */
  transName(){
    let jaText = document.getElementById("jaText").value
    if (jaText.length >= config.ja_text_name_len) {
      alert("名前は" + config.ja_text_name_len + "文字以内にしてください")
      return
    }
    let codeCase = document.getElementById("caseSelect").value

    // TODO プログレスバーを追加したい
    let request = {
      function: "getTranslatedText",
      parameters: {
        parameter: {
          headCharType: "lower",
          text: jaText,
          codeCase: codeCase,
        }
      },
      devMode: true,
    };
    let op = window.gapi.client.request({
      root: 'https://script.googleapis.com',
      path: 'v1/scripts/' + config.API_ID + ':run',
      method: 'POST',
      body: request
    });
    
    op.execute(function(resp) {
      // エラー
      if (resp.error) {
        console.error('Error calling API:');
        console.error(resp.err);
      } else {
        let resultJson = JSON.parse(resp.response.result)
        if (resultJson.result === "success") {
          document.getElementById("enText").value = resultJson.text
          // TODO 自動的にクリップボードにコピー
        } else {
          // TODO エラー処理
        }
      }
    })
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient() {
    window.gapi.auth2.init({
      apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(function () {
      window.gapi.auth2.getAuthInstance().signIn().then(function(){
        // ログイン成功なら何もしない
      })
      .catch(function () {
        alert("ログインしていないため実行できません。")
      })
    })
  }

  render() {
    // TODO BootStrapでデバイス毎にレスポンシブにする
    return (
        <div>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Method Name Creator</h1>
              <h2 className="App-title">メソッド・変数名を日本語から変換します</h2>
            </header>
          </div>
          <div className="container app-container col-md-offset-3 col-md-6">
            <form>
              <div className="row">
                <input id="jaText" type="text" placeholder="日本語の処理・単語名" className="form-control"/>
              </div>
              <div className="row form-group case-view">
                <select name="caseSelect" className="form-control col-md-3" id="caseSelect">
                  <option value="camel">キャメルケース</option>
                  <option value="snake">スネークケース</option>
                  <option value="kebab">ケバブケース</option>
                </select>
              </div>
              <div className="row form-group">
                <button type="button" className="form-control btn btn-primary" onClick={this.transName}>変換</button>
              </div>
              <span className="arrow">∨</span>
              <div className="row">
                <input id="enText" type="text" placeholder="英語の関数・変数名" className="form-control" onKeyUp={this.copyEnText}/>
              </div>
            </form>
          </div>
        </div>
    );
  }
}
