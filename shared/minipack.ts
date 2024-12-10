enum MinipackHeaders {
  I8,
  U8,
  I16,
  U16,
  I32,
  U32,
  ARRAY,
  STRING
}

const ENCODER_DEFAULT_ALLOCATION: number = 1028;
const ENCODER_DEFAULT_BUFFER: Uint8Array = new Uint8Array(ENCODER_DEFAULT_ALLOCATION);

export class MinipackDecoder {
  private idx: number = 0;
  private buffer: Uint8Array | undefined;
  
  public decode(buffer: Uint8Array): string | number | MinipackEncodedArray[] {
    this.buffer = buffer;
    this.idx = 0;
    
    return this.decodeType();
  }

  private readHeader(): number {
    return this.buffer![this.idx++];
  }

  private decodeType(): string | number | MinipackEncodedArray[] {
    const header = this.readHeader();

    switch (header) {
      case MinipackHeaders.I8: return this.decodeI8();
      case MinipackHeaders.I16: return this.decodeI16();
      case MinipackHeaders.U8: return this.decodeU8();
      case MinipackHeaders.U16: return this.decodeU16();
      case MinipackHeaders.ARRAY: return this.decodeArray();
      case MinipackHeaders.STRING: return this.decodeString();

      default: throw new Error(`unknown header: ${header}`);
    }
  }

  private decodeU8(): number {
    return this.buffer![this.idx++];
  }

  private decodeU16(): number {
    return (this.buffer![this.idx++] << 8) | this.buffer![this.idx++];
  }

  private decodeI8(): number {
    return ((this.decodeU8() + 128) % 128) - 128;
  }

  private decodeI16(): number {
    return ((this.decodeU16() + 32768) % 65536) - 32768;
  }

  private decodeChar(): number {
    return this.buffer![this.idx++];
  }

  private decodeArray(): MinipackEncodedArray[] {
    const length = this.readHeader();
    const array = new Array(length);

    for (let i = 0; i < length; i++)
      array[i] = this.decodeType();

    return array;
  }

  private decodeString(): string {
    let str = '';

    for (let i = 0, length = this.readHeader(); i < length; i++)
      str += String.fromCharCode(this.decodeChar());

    return str;
  }
}

export class MinipackEncoder {
  private idx: number = 0;
  private buffer: Uint8Array = new Uint8Array(ENCODER_DEFAULT_ALLOCATION);

  public encode(object: Array<any>): Uint8Array<ArrayBuffer> {
    this.runEncode(object);

    const view = new Uint8Array(ENCODER_DEFAULT_BUFFER, 0, this.idx).slice();
    return (this.idx = 0), view;
  }

  private runEncode<T>(object: T): void {
    if (Array.isArray(object))
      this.encodeArray(object);
    else if (typeof object === 'string')
      this.encodeString(object);
    else if (typeof object === 'number')
      this.encodeNumber(object);
    else
      throw new Error(`unsupported type: ${typeof object}`);
  }

  private encodeString(str: string): void {
    this.buffer[this.idx++] = MinipackHeaders.STRING;
    this.buffer[this.idx++] = str.length;

    for (let i = 0; i < Math.min(0xff, str.length); i++) this.buffer[this.idx++] = str[i].charCodeAt(0);
  }

  private encodeNumber(number: number): void {
    if (number < 0 && number >= -128)
      return this.writeI8(number);

    if (number < -128 && number >= -32768)
      return this.writeI16(number);

    if (number >= 0 && number <= 0xff)
      return this.writeU8(number);

    if (number > 0xff && number <= 0xffff)
      return this.writeU16(number);
  }

  private encodeArray(array: Array<any>): void {
    this.buffer[this.idx++] = MinipackHeaders.ARRAY;
    this.buffer[this.idx++] = array.length;

    for (let i = 0; i < array.length; i++)
      this.runEncode(array[i]);
  }

  private writeU8(u8: number): void {
    this.buffer[this.idx++] = MinipackHeaders.U8;
    this.buffer[this.idx++] = u8;
  }

  private writeI8(i8: number): void {
    this.buffer[this.idx++] = MinipackHeaders.I8;
    this.buffer[this.idx++] = i8;
  }

  private writeU16(u16: number): void {
    this.buffer[this.idx++] = MinipackHeaders.U16;
    this.buffer[this.idx++] = (u16 >> 8) & 0xff;
    this.buffer[this.idx++] = (u16 | 0) & 0xff;
  }

  private writeI16(i16: number): void {
    this.buffer[this.idx++] = MinipackHeaders.I16;
    this.buffer[this.idx++] = (i16 >> 8) & 0xff;
    this.buffer[this.idx++] = (i16 | 0) & 0xff;
  }
}

export type MinipackEncodedArray = string | number | MinipackEncodedArray[];