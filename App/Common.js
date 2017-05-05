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
}