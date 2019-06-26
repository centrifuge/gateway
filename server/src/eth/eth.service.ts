import { Injectable } from '@nestjs/common';
import { Transaction } from "web3/eth/types";
const Eth = require('ethjs');

// TODO: set provider via config here
const eth = new Eth(new Eth.HttpProvider('https://goerli.infura.io/v3/c2952fa55ecb476d95f190d01a5729d1'));

@Injectable()
export class EthService {
  getTransactionByHash(hash: string): Promise<Transaction> {
    return eth.getTransactionByHash(hash)
  }
}