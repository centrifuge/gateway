import { Injectable } from '@nestjs/common';
const Eth = require('ethjs');

// set provider via config here
const eth = new Eth(new Eth.HttpProvider('https://goerli.infura.io/v3/c2952fa55ecb476d95f190d01a5729d1'));

@Injectable()
export class EthService {

  getTransactionByHash(hash: string) {
    return eth.getTransactionByHash(hash)
  }
}