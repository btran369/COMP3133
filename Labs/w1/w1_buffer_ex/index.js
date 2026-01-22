
const buf1 = Buffer.from("A Hello")
console.log(buf1)
console.log(buf1.toString())
console.log(buf1.length) //41
console.log(buf1[0]) //65

const buf2 = Buffer.alloc(10).fill("A")
console.log(buf2)
console.log(buf2.length) //10
buf2[0] = 66
buf2[1] = 'C'.charCodeAt(0)
console.log(buf2.toString())

// const tempBuffer = new Buffer(5)
const a = "👌👌👌"
const buf3 = Buffer.from(a)
console.log(buf3)
console.log(buf3.toString())
console.log(buf3.length)

// const aBuffer = Buffer.from([65,66,67])
const aBuffer = Buffer.from([0x41, 0x42, 0x43])
console.log(aBuffer)
console.log(aBuffer.toString())
console.log(aBuffer.length)
console.log(aBuffer.toString('utf-8'))
console.log(aBuffer.toString('hex'))

const bBuffer = Buffer.from('BBC', 'utf-8')
console.log(aBuffer.compare(bBuffer))

const data = Buffer.from("George Brown Polytechnic")
data.forEach((byte, index) => {
    console.log(`Byte ${byte} at index ${index}: ${String.fromCharCode(byte)}`)
});

const nameBuffer = Buffer.alloc(20)
nameBuffer.write('Hello')
console.log(nameBuffer.toString())
console.log(nameBuffer.byteLength)
nameBuffer.write('World',7, 'ascii')
console.log(nameBuffer.toString())
nameBuffer.write('NodeJS',0)
console.log(nameBuffer.toString())
console.log(nameBuffer.toJSON())