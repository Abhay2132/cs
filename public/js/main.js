const log = console.log
const $ = q => document.querySelector(q);

$("[name=input_file]").addEventListener("change", e => {
	for(let file of e.target.files){
		log(file)
	}
})