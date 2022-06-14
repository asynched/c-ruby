class CodeGenerator {
	static fromDefaults() {
		return new CodeGenerator()
	}

	getBounded(type) {
		return this[type].bind(this)
	}

	fromAST(ast) {
		const handler = this.getBounded(ast.type)
		return handler(ast)
	}

	Program(program) {
		return program.body
			.filter(Boolean)
			.map((statement) => this[statement.type](statement))
			.join('\n')
	}

	ImportDeclaration(declaration) {
		const { std, value } = declaration.source

		if (std) {
			return `#include <${value}>`
		}

		return `#include ${value}`
	}

	FunctionDeclaration(declaration) {
		const {
			id: { name },
			returnType: { name: returnType },
		} = declaration

		const rawParams = declaration.params
		const params =
			rawParams.length > 0
				? rawParams
						.map((param) => {
							const { name } = param.name
							const { name: type } = param.typing
							return this.GetType(type) + ' ' + name
						})
						.join(', ')
				: 'void'

		const body = this.BlockStatement(declaration.body)

		return `${this.GetType(returnType)} ${name} (${params}) {\n\t${body}\n}`
	}

	BlockStatement(block) {
		return block.body
			.filter(Boolean)
			.map((statement) => this[statement.type](statement) + ';')
			.join('\n\t')
	}

	ReturnStatement(statement) {
		const returnValue = this[statement.argument.type](statement.argument)
		return `return ${returnValue}`
	}

	ExpressionStatement(statement) {
		return `${this[statement.expression.type](statement.expression)};`
	}

	GetType(type) {
		if (type.includes('*')) {
			const parsed = type.split('*')[1]
			return `${parsed}*`
		}

		return type
	}

	VariableDeclaration(declaration) {
		const {
			mutable,
			id: { name },
			typing: { name: typing },
			value,
		} = declaration

		const type = this.GetType(typing)
		const parsedValue = this[value.type](value)

		return `${mutable ? '' : 'const '}${type} ${name} = ${parsedValue}`
	}

	CallExpression(expression) {
		const {
			callee: { name },
			arguments: args,
		} = expression

		return `${this.GetType(name)}(${args
			.map((arg) => this[arg.type](arg))
			.join(', ')})`
	}

	Literal(literal) {
		return literal.value
	}

	BinaryExpression(expression) {
		const { left, right, op } = expression
		return `${this[left.type](left)} ${op} ${this[right.type](right)}`
	}

	Identifier(identifier) {
		return identifier.name
	}
}

module.exports = CodeGenerator
