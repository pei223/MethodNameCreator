import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SearchBox.css'
import config from "./config.json"
const SCOPES = 'https://www.googleapis.com/auth/script.projects'
const DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"]

export default class SearchBox extends React.Component {
  constructor(props){
    super(props)
    this.isSignedIn = false
    // GoogleのクライアントAPIセットアップ
    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = () => {
      window.gapi.load('client:auth2:client/request:client/script/scripts', () => {
        window.gapi.auth.authorize({client_id: config.CLIENT_ID, scope: SCOPES, immediate: true}, this.initClient)
      })
    }
    document.body.appendChild(script)
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
    else if (jaText.length === 0) {
      alert("文字を入力してください")
      return
    }
    let codeCase = document.getElementById("caseSelect").value

    // TODO プログレスバーを追加したい
    let request = {
      function: "getTranslatedText",
      parameters: {
        parameter: {
          text: jaText,
          codeCase: codeCase,
        }
      },
      devMode: true,
    }
    this.props.showProgressBar()
    let op = window.gapi.client.request({
      root: 'https://script.googleapis.com',
      path: 'v1/scripts/' + config.API_ID + ':run',
      method: 'POST',
      body: request
    })
    
    op.execute(function(resp) {
      // エラー
      if (resp.error) {
        console.error('Error calling API:')
        console.error(resp.err)
      } else {
        let resultJson = JSON.parse(resp.response.result)
        if (resultJson.result === "success") {
            // 英語テキストボックスに値を設定する
            this.props.setEnText(resultJson.text)
        } else {
          // TODO エラー処理
        }
        this.props.hideProgressBar()
      }
    }.bind(this))
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

  /**
   * Enter時のみ変換Actionを実行する
   * @param {} e 
   */
  doTransIfEnterKey(e){
      if (e.keyCode === 13) {
          this.transName()
      }
  }

  /**
   * ケースの値に保存されているクッキーの値を取得して適用する
   */
  applyCookieValueToCase() {
    let selectCaseNode = document.getElementById("caseSelect")
    let cookieValue = this.getCaseFromCookie()
    if (cookieValue !== "") {
      selectCaseNode.value = cookieValue
    }
  }

  /**
   * クッキーに保存されているケースの値を取得する
   */
  getCaseFromCookie() {
    const caseSelectAttribute = "caseSelect"
    let cookies = document.cookie.split(";")
    for (let i=0 ; i < cookies.length ; i++) {
      let cookieItem = cookies[i].trim().split("=")
      if (cookieItem[0] === caseSelectAttribute) {
        return cookieItem[1]
      }
    }
    return ""
  }

  /**
   * クッキーにケースの値を保存する
   */
  saveCaseInCookie() {
    const caseSelectAttribute = "caseSelect"
    let selectCaseNode = document.getElementById("caseSelect")
    let value = selectCaseNode.options[selectCaseNode.selectedIndex].value
    document.cookie = caseSelectAttribute + "=" + value
  }

  componentDidMount() {
    this.applyCookieValueToCase()
  }

  render() {
    // TODO BootStrapでデバイス毎にレスポンシブにする
    return (
        <div onKeyDown={this.doTransIfEnterKey.bind(this)}>
            <div className="row">
                <input id="jaText" type="text" placeholder="日本語の処理・単語名" className="form-control" />
            </div>
            <div className="row form-group case-view">
                <select name="caseSelect" className="form-control col-12 col-sm-6 col-md-5 col-lg-5" id="caseSelect" onChange={this.saveCaseInCookie.bind(this)}>
                    <option value="camel">キャメルケース</option>
                    <option value="pascal">パスカルケース</option>
                    <option value="snake">スネークケース</option>
                    <option value="snake_const">スネークケース(全て大文字)</option>
                    <option value="kebab">ケバブケース</option>
                </select>
            </div>
            <div className="row form-group">
                <button type="button" className="form-control btn btn-primary"  onClick={this.transName.bind(this)}>変換</button>
            </div>
        </div>
    )
  }
}
