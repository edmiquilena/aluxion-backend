export interface simpleVersioning {
    version: number;
  }
  export interface RecoveryPath {
    root: string,
    recovery: string
  }
  export interface AWSConnection {
    accessKeyId: string,
    secretAccessKey:  string
  }