# js-y86-64
[![Preview of simulator](http://image.prntscr.com/image/414ee45420ac40b9a6f30a35e1a7aebd.png)](https://boginw.github.io/js-y86-64/)

**js-y86-64** is an assembler and simulator written in Javascript. It supports:

* All of the original Y86-64 instructions plus cmovX
* Breakpoints via `brk`
* Step-by-step execution
* Inspect the contents of the registers, flags, and memory after every instruction
* Manually pause if you get stuck in an infinite loop
* Syntax highlighting
* See your (hopefully useful) compile errors as you type

[See it in action](https://boginw.github.io/js-y86-64/) or [read the documentation on the Wiki](https://github.com/boginw/js-y86-64/wiki).

This repo is forked from [xsznix](https://github.com/xsznix/js-y86), which is built around [vagulars](https://github.com/vaguilar/js-y86) assembler. This project extends both previous repos with support for Y86-**64**. Although most browsers don't support 64-bit integers, we make use of [long.js](https://github.com/dcodeIO/long.js) in order to achive 64-bit (although it doesn't make your programs run faster, quite the contrary).

## License

This project is licensed under the terms of the MIT license.

