const fs = require('fs')
const parser = require('./crb.parser')
const generator = require('./crb')

const filename = process.argv[2]

console.log(
	generator
		.fromDefaults()
		.fromAST(parser.parse(fs.readFileSync(filename, 'utf8')))
)
