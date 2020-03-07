function delay(duration) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), duration);
	});
}

var finished = false

!function deleteMessages(created_by_kando) {
	const channel = '' // <- Persons channel ID
	const author = '' // <- Your User ID
	const headers = { "Authorization": YOUR_TOKEN_HERE }
	
	const api = `https://discordapp.com/api/v6/channels/${channel}/messages/search?author_id=${author}&offset=0`
	const baseURL = `https://discordapp.com/api/channels/${channel}/messages`

	fetch(api, {headers})
		.then(res => res.json())
		.then(res => {
			console.log(`Messages left: ${res.total_results}`)

			if(res.total_results == 0) finished = true

			let clock = 0
			let wait = 500

			return Promise.all(res.messages.map(message => {
				return delay((clock += wait))
					.then(() => {
						fetch(`${baseURL}/${message[2].id}`, {headers, method: 'DELETE'})
							.then(() => console.log(`Message removed: ${message[2].id}`))
					})
			}))
		})
		.then(() => {
			if(!finished) deleteMessages()
		})
}(1337)
