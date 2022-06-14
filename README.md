# c-ruby

A language implemented mainly for the purpose of learning. This is meant to be a language with a syntax close to Ruby that transpiles to C code.

## Example

This c-ruby snippet

```crb
import <stdio.h>
import <stdlib.h>

fn say_hello(name: *char) -> void do
	printf("Hello, %s!\n", name)
end

fn print_person(name: *char, age: int) -> void do
	printf("Person<name=%s, age=%d>\n", name, age)
end

fn main -> int do
	name: *char = "Eder"
	age: int = 20
	say_hello(name)
	print_person(name, age)
	return 0
end
```

Turns into this when transpiled into C code:

```c
#include <stdio.h>
#include <stdlib.h>
void say_hello (char* name) {
	printf("Hello, %s!\n", name);
}
void print_person (char* name, int age) {
	printf("Person<name=%s, age=%d>\n", name, age);
}
int main (void) {
	char* name = "Eder";
	int age = 20;
	say_hello(name);
	print_person(name, age);
	return 0;
}
```

## Development

### Requirements

-   NodeJS
-   GCC

### Parsing a file

Check if the syntax is valid and generate an AST.

```sh
$ yarn dev:parse <file>
```

### Building the parser

Build the parser module to use in conjunction with the codegen.

```sh
$ yarn build:parser
```

### Transpiling

Turning c-ruby into c code.

```sh
$ yarn transpile <file>
```

### Author

| ![Eder Lima](https://github.com/asynched.png?size=100) |
| ------------------------------------------------------ |
| [Eder Lima](https://github.com/asynched)               |
