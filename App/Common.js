import React from 'react'

export default class Common {
    static schemaCheck(url, match){
        const search = new RegExp(`^(https?\:\/\/)?${url}$`, 'i')
        const result = search.test(match)
        return result
    }

    static schemaHasProtocol(match){
        const search = new RegExp(`^https?\:\/\/`, 'i')
        return search.test(match)
    }

    static ensureUrlHasProtocol(url){
        if(!Common.schemaHasProtocol(url)){
          url = `http://${url}`
        }

        return url
    }

    // Control the status bar visibility 
    static toggleStatusBar(statusbar, value, animation){
        statusbar.setHidden(value, animation)
        return Promise.resolve()
    }

    //strip image context 
    static ensureDataUrlIsCleanOfContext(url){
        if(!url) return ''
        const result = url.split(',')[1];
        if(result)
            return result
        else
            return url
    }

  static ensureDataUrlHasContext(url){
    if(!url) return ''
    url = this.ensureDataUrlIsCleanOfContext(url)
    if (!url.startsWith('http')) {
      return `data:image/jpg;base64,${url}`
    } else {
      return url
    }
  }

  static defaultDataUrl(){
      return 'data:image/jpg;base64,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';
  }

    // Hit areas on buttons
    static touchableArea = {top: 140, left: 140, bottom: 140, right: 140}

}

